"""
PhishGuard AI - Machine Learning Model Training
Train phishing detection model using Random Forest and XGBoost
"""

import numpy as np
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier
import os

class PhishingModelTrainer:
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = None
        self.feature_names = None
    
    def extract_features_from_url(self, url):
        """Extract features from a URL"""
        try:
            from urllib.parse import urlparse
            import re
            
            parsed = urlparse(url)
            hostname = parsed.hostname or parsed.netloc
            path = parsed.path
            query = parsed.query
            
            # URL-based features
            features = {
                'url_length': len(url),
                'dot_count': url.count('.'),
                'hyphen_count': url.count('-'),
                'has_at': 1 if '@' in url else 0,
                'has_https': 1 if parsed.scheme == 'https' else 0,
                'path_length': len(path),
                'query_length': len(query),
            }
            
            # Domain features
            subdomains = hostname.split('.') if hostname else []
            features['subdomain_count'] = len(subdomains) - 2 if len(subdomains) > 2 else 0
            
            # Check for IP address
            features['ip_address'] = 1 if re.match(r'^\d+\.\d+\.\d+\.\d+$', hostname or '') else 0
            
            # Check for tiny URL
            features['tiny_url'] = 1 if len(hostname or '') < 10 else 0
            
            # Check for port
            features['has_port'] = 1 if ':' in (hostname or '') else 0
            
            # Suspicious keywords
            suspicious_keywords = [
                'login', 'signin', 'verify', 'account', 'update', 'confirm', 'secure',
                'banking', 'password', 'credential', 'authenticate', 'validation',
                'suspend', 'limited', 'access', 'security', 'alert', 'warning',
                'free', 'gift', 'prize', 'winner', 'lottery', 'claim',
                'urgent', 'immediate', 'action-required'
            ]
            features['suspicious_keywords'] = sum(1 for kw in suspicious_keywords if kw in url.lower())
            
            # Brand impersonation
            brands = ['paypal', 'apple', 'microsoft', 'google', 'facebook', 'amazon',
                     'netflix', 'spotify', 'instagram', 'twitter', 'linkedin',
                     'chase', 'bankofamerica', 'wellsfargo', 'citi', 'amex']
            features['brand_impersonation'] = sum(1 for brand in brands if brand in (hostname or '').lower())
            
            return features
        except Exception as e:
            print(f"Error extracting features: {e}")
            return None
    
    def load_dataset(self, csv_path='model/dataset/phishing_dataset.csv'):
        """Load phishing dataset"""
        if not os.path.exists(csv_path):
            print(f"Dataset not found at {csv_path}")
            print("Creating sample dataset...")
            self._create_sample_dataset(csv_path)
        
        df = pd.read_csv(csv_path)
        return df
    
    def _create_sample_dataset(self, csv_path):
        """Create a sample dataset for demonstration"""
        os.makedirs(os.path.dirname(csv_path), exist_ok=True)
        
        # Sample legitimate URLs
        legit_urls = [
            'https://www.google.com',
            'https://www.github.com',
            'https://www.stackoverflow.com',
            'https://www.microsoft.com',
            'https://www.apple.com',
            'https://www.amazon.com',
            'https://www.linkedin.com',
            'https://www.twitter.com',
            'https://www.facebook.com',
            'https://www.youtube.com',
        ]
        
        # Sample phishing URLs
        phishing_urls = [
            'http://192.168.1.1/login',
            'https://paypal-secure-login.tk/verify',
            'http://apple-id-update.com/account',
            'https://bank-of-america-login.ml/signin',
            'http://microsoft-support-alert.com/warning',
            'https://amazon-account-verify.ga/update',
            'http://chase-bank-login.cf/confirm',
            'https://facebook-security-check.tk/verify',
            'http://google-account-suspend.ml/alert',
            'https://netflix-payment-update.ga/billing',
        ]
        
        data = []
        for url in legit_urls:
            features = self.extract_features_from_url(url)
            if features:
                features['label'] = 0  # Legitimate
                data.append(features)
        
        for url in phishing_urls:
            features = self.extract_features_from_url(url)
            if features:
                features['label'] = 1  # Phishing
                data.append(features)
        
        df = pd.DataFrame(data)
        df.to_csv(csv_path, index=False)
        print(f"Sample dataset created at {csv_path}")
    
    def train_random_forest(self, X_train, y_train):
        """Train Random Forest classifier"""
        print("Training Random Forest model...")
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        model.fit(X_train, y_train)
        return model
    
    def train_xgboost(self, X_train, y_train):
        """Train XGBoost classifier"""
        print("Training XGBoost model...")
        model = XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42,
            use_label_encoder=False,
            eval_metric='logloss'
        )
        model.fit(X_train, y_train)
        return model
    
    def evaluate_model(self, model, X_test, y_test):
        """Evaluate model performance"""
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print("\n" + "="*50)
        print("Model Evaluation Report")
        print("="*50)
        print(f"\nAccuracy: {accuracy * 100:.2f}%")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        print("\nConfusion Matrix:")
        print(confusion_matrix(y_test, y_pred))
        
        # Cross-validation
        print("\nCross-Validation Scores:")
        cv_scores = cross_val_score(model, X_test, y_test, cv=5)
        print(f"Mean CV Score: {cv_scores.mean() * 100:.2f}% (+/- {cv_scores.std() * 2:.2f}%)")
        
        return accuracy
    
    def save_model(self, model, model_path='model/phishing_model.pkl'):
        """Save trained model"""
        os.makedirs(os.path.dirname(model_path), exist_ok=True)
        with open(model_path, 'wb') as f:
            pickle.dump({
                'model': model,
                'scaler': self.scaler,
                'feature_names': self.feature_names
            }, f)
        print(f"\nModel saved to {model_path}")
    
    def load_model(self, model_path='model/phishing_model.pkl'):
        """Load trained model"""
        with open(model_path, 'rb') as f:
            data = pickle.load(f)
            self.model = data['model']
            self.scaler = data['scaler']
            self.feature_names = data['feature_names']
        print(f"Model loaded from {model_path}")
        return self.model
    
    def predict(self, url):
        """Predict if URL is phishing"""
        if not self.model:
            raise ValueError("Model not loaded. Call load_model() first.")
        
        features = self.extract_features_from_url(url)
        if not features:
            return None
        
        feature_vector = np.array([[features[name] for name in self.feature_names]])
        feature_vector_scaled = self.scaler.transform(feature_vector)
        
        prediction = self.model.predict(feature_vector_scaled)[0]
        probability = self.model.predict_proba(feature_vector_scaled)[0]
        
        return {
            'prediction': int(prediction),
            'label': 'Phishing' if prediction == 1 else 'Legitimate',
            'confidence': float(max(probability)),
            'probabilities': {
                'legitimate': float(probability[0]),
                'phishing': float(probability[1])
            }
        }
    
    def train(self, model_type='random_forest'):
        """Train the model"""
        print("Loading dataset...")
        df = self.load_dataset()
        
        # Separate features and labels
        X = df.drop('label', axis=1)
        y = df['label']
        
        self.feature_names = X.columns.tolist()
        
        # Split dataset
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        if model_type == 'random_forest':
            self.model = self.train_random_forest(X_train_scaled, y_train)
        elif model_type == 'xgboost':
            self.model = self.train_xgboost(X_train_scaled, y_train)
        else:
            raise ValueError(f"Unknown model type: {model_type}")
        
        # Evaluate
        accuracy = self.evaluate_model(self.model, X_test_scaled, y_test)
        
        # Save model
        self.save_model(self.model)
        
        return accuracy


def main():
    """Main training function"""
    print("="*50)
    print("PhishGuard AI - Model Training")
    print("="*50)
    
    trainer = PhishingModelTrainer()
    
    # Train Random Forest
    print("\n" + "="*50)
    print("Training Random Forest Model")
    print("="*50)
    rf_accuracy = trainer.train(model_type='random_forest')
    
    # Train XGBoost
    print("\n" + "="*50)
    print("Training XGBoost Model")
    print("="*50)
    xgb_trainer = PhishingModelTrainer()
    xgb_accuracy = xgb_trainer.train(model_type='xgboost')
    
    print("\n" + "="*50)
    print("Training Complete!")
    print("="*50)
    print(f"\nRandom Forest Accuracy: {rf_accuracy * 100:.2f}%")
    print(f"XGBoost Accuracy: {xgb_accuracy * 100:.2f}%")
    print("\nBest model saved to: model/phishing_model.pkl")


if __name__ == '__main__':
    main()
