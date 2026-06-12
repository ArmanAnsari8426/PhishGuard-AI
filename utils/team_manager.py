"""
PhishGuard AI - Team Management
Manage teams, roles, and collaboration features
"""

import hashlib
from datetime import datetime

class TeamManager:
    def __init__(self):
        self.teams = {}
        self.invitations = {}
    
    def create_team(self, name, owner_id, description=""):
        """Create a new team"""
        team_id = hashlib.md5(f"{owner_id}:{name}:{datetime.now()}".encode()).hexdigest()[:12]
        
        team = {
            'id': team_id,
            'name': name,
            'description': description,
            'owner_id': owner_id,
            'members': [{
                'user_id': owner_id,
                'role': 'owner',
                'joined_at': datetime.now().isoformat()
            }],
            'settings': {
                'allow_member_invite': True,
                'scan_notifications': True,
                'weekly_reports': True
            },
            'created_at': datetime.now().isoformat(),
            'plan': 'free',
            'member_limit': 5
        }
        
        self.teams[team_id] = team
        return team
    
    def get_team(self, team_id):
        """Get team details"""
        return self.teams.get(team_id)
    
    def get_user_teams(self, user_id):
        """Get all teams user belongs to"""
        user_teams = []
        for team in self.teams.values():
            if any(m['user_id'] == user_id for m in team['members']):
                user_teams.append(team)
        return user_teams
    
    def invite_member(self, team_id, inviter_id, email, role='member'):
        """Invite a member to team"""
        team = self.teams.get(team_id)
        if not team:
            return None, "Team not found"
        
        # Check if inviter has permission
        inviter = next((m for m in team['members'] if m['user_id'] == inviter_id), None)
        if not inviter or inviter['role'] not in ['owner', 'admin']:
            return None, "Insufficient permissions"
        
        # Check member limit
        if len(team['members']) >= team['member_limit']:
            return None, "Team member limit reached"
        
        # Check if already a member
        if any(m['user_id'] == email for m in team['members']):
            return None, "User is already a member"
        
        invitation_id = hashlib.md5(f"{team_id}:{email}:{datetime.now()}".encode()).hexdigest()[:12]
        
        invitation = {
            'id': invitation_id,
            'team_id': team_id,
            'team_name': team['name'],
            'invited_by': inviter_id,
            'email': email,
            'role': role,
            'status': 'pending',
            'created_at': datetime.now().isoformat(),
            'expires_at': datetime.now().replace(day=datetime.now().day + 7).isoformat()
        }
        
        self.invitations[invitation_id] = invitation
        return invitation, "Invitation sent"
    
    def accept_invitation(self, invitation_id, user_id):
        """Accept team invitation"""
        invitation = self.invitations.get(invitation_id)
        if not invitation:
            return None, "Invitation not found"
        
        if invitation['status'] != 'pending':
            return None, "Invitation is no longer valid"
        
        team = self.teams.get(invitation['team_id'])
        if not team:
            return None, "Team not found"
        
        # Add member
        team['members'].append({
            'user_id': user_id,
            'role': invitation['role'],
            'joined_at': datetime.now().isoformat()
        })
        
        invitation['status'] = 'accepted'
        
        return team, "Successfully joined team"
    
    def remove_member(self, team_id, user_id, removed_by):
        """Remove member from team"""
        team = self.teams.get(team_id)
        if not team:
            return False, "Team not found"
        
        # Check permissions
        remover = next((m for m in team['members'] if m['user_id'] == removed_by), None)
        if not remover or remover['role'] not in ['owner', 'admin']:
            return False, "Insufficient permissions"
        
        # Cannot remove owner
        member = next((m for m in team['members'] if m['user_id'] == user_id), None)
        if member and member['role'] == 'owner':
            return False, "Cannot remove team owner"
        
        team['members'] = [m for m in team['members'] if m['user_id'] != user_id]
        return True, "Member removed"
    
    def update_member_role(self, team_id, user_id, new_role, updated_by):
        """Update member role"""
        team = self.teams.get(team_id)
        if not team:
            return False, "Team not found"
        
        # Check permissions
        updater = next((m for m in team['members'] if m['user_id'] == updated_by), None)
        if not updater or updater['role'] != 'owner':
            return False, "Only team owner can update roles"
        
        member = next((m for m in team['members'] if m['user_id'] == user_id), None)
        if not member:
            return False, "Member not found"
        
        member['role'] = new_role
        return True, "Role updated"
    
    def update_team_settings(self, team_id, user_id, settings):
        """Update team settings"""
        team = self.teams.get(team_id)
        if not team:
            return False, "Team not found"
        
        # Check permissions
        user = next((m for m in team['members'] if m['user_id'] == user_id), None)
        if not user or user['role'] not in ['owner', 'admin']:
            return False, "Insufficient permissions"
        
        team['settings'].update(settings)
        return True, "Settings updated"
    
    def get_team_activity(self, team_id, limit=50):
        """Get team activity log"""
        team = self.teams.get(team_id)
        if not team:
            return []
        
        # Simulated activity log
        activities = [
            {
                'id': 1,
                'type': 'scan',
                'user': team['owner_id'],
                'action': 'Scanned URL',
                'details': 'https://example.com',
                'timestamp': datetime.now().isoformat()
            },
            {
                'id': 2,
                'type': 'member',
                'user': team['owner_id'],
                'action': 'Added new member',
                'details': 'user@example.com',
                'timestamp': datetime.now().isoformat()
            }
        ]
        
        return activities[:limit]
    
    def get_team_stats(self, team_id):
        """Get team statistics"""
        team = self.teams.get(team_id)
        if not team:
            return None
        
        return {
            'team_id': team_id,
            'member_count': len(team['members']),
            'member_limit': team['member_limit'],
            'total_scans': 1234,  # Simulated
            'threats_found': 56,  # Simulated
            'active_this_week': len(team['members']),  # Simulated
            'storage_used': '125 MB',
            'api_calls': 5000
        }
    
    def delete_team(self, team_id, user_id):
        """Delete a team"""
        team = self.teams.get(team_id)
        if not team:
            return False, "Team not found"
        
        if team['owner_id'] != user_id:
            return False, "Only team owner can delete the team"
        
        del self.teams[team_id]
        return True, "Team deleted"


class RoleManager:
    """Manage user roles and permissions"""
    
    ROLES = {
        'owner': {
            'description': 'Full access to all features',
            'permissions': [
                'team.create', 'team.delete', 'team.update',
                'member.add', 'member.remove', 'member.update_role',
                'scan.create', 'scan.view_all', 'scan.delete',
                'settings.update', 'billing.manage',
                'reports.view', 'reports.export',
                'api.manage', 'webhook.manage'
            ]
        },
        'admin': {
            'description': 'Can manage members and scans',
            'permissions': [
                'member.add', 'member.remove',
                'scan.create', 'scan.view_all', 'scan.delete',
                'settings.update',
                'reports.view', 'reports.export'
            ]
        },
        'analyst': {
            'description': 'Can view and create scans',
            'permissions': [
                'scan.create', 'scan.view_team',
                'reports.view', 'reports.export'
            ]
        },
        'viewer': {
            'description': 'Can only view reports',
            'permissions': [
                'scan.view_team',
                'reports.view'
            ]
        },
        'member': {
            'description': 'Basic member access',
            'permissions': [
                'scan.create',
                'reports.view_own'
            ]
        }
    }
    
    @classmethod
    def check_permission(cls, role, permission):
        """Check if role has specific permission"""
        role_data = cls.ROLES.get(role, {})
        permissions = role_data.get('permissions', [])
        return permission in permissions
    
    @classmethod
    def get_role_permissions(cls, role):
        """Get all permissions for a role"""
        return cls.ROLES.get(role, {}).get('permissions', [])
    
    @classmethod
    def can_perform(cls, user_role, action):
        """Check if user can perform action"""
        return cls.check_permission(user_role, action)
