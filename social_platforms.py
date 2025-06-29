import os
import requests
import asyncio
from typing import Tuple, Optional
import json
import aiohttp

class SocialMediaManager:
    """Manage posting to multiple social media platforms"""
    
    def __init__(self):
        # Load API credentials from environment
        self.telegram_token = os.getenv("TELEGRAM_BOT_TOKEN")
        self.telegram_chat_id = os.getenv("TELEGRAM_CHAT_ID")
        self.instagram_token = os.getenv("INSTAGRAM_ACCESS_TOKEN")
        self.instagram_account_id = os.getenv("INSTAGRAM_ACCOUNT_ID")
        self.youtube_api_key = os.getenv("YOUTUBE_API_KEY")
        self.youtube_channel_id = os.getenv("YOUTUBE_CHANNEL_ID")
        self.tiktok_access_token = os.getenv("TIKTOK_ACCESS_TOKEN")
        self.tiktok_open_id = os.getenv("TIKTOK_OPEN_ID")
    
    async def post_to_telegram(self, content: str, file_path: Optional[str] = None, file_type: Optional[str] = None) -> Tuple[bool, str]:
        """Post to Telegram"""
        if not self.telegram_token or not self.telegram_chat_id:
            return False, "Telegram credentials not configured"
        
        try:
            url = f"https://api.telegram.org/bot{self.telegram_token}"
            
            if file_path and file_type:
                # Send with media
                if file_type == "image":
                    endpoint = f"{url}/sendPhoto"
                    with open(file_path, 'rb') as photo:
                        files = {'photo': photo}
                        data = {
                            'chat_id': self.telegram_chat_id,
                            'caption': content
                        }
                        response = requests.post(endpoint, files=files, data=data)
                elif file_type == "video":
                    endpoint = f"{url}/sendVideo"
                    with open(file_path, 'rb') as video:
                        files = {'video': video}
                        data = {
                            'chat_id': self.telegram_chat_id,
                            'caption': content
                        }
                        response = requests.post(endpoint, files=files, data=data)
                else:
                    return False, "Unsupported file type for Telegram"
            else:
                # Send text only
                endpoint = f"{url}/sendMessage"
                data = {
                    'chat_id': self.telegram_chat_id,
                    'text': content
                }
                response = requests.post(endpoint, json=data)
            
            if response.status_code == 200:
                return True, "Posted successfully to Telegram"
            else:
                error_data = response.json()
                return False, f"Telegram API error: {error_data.get('description', 'Unknown error')}"
                
        except Exception as e:
            return False, f"Telegram posting failed: {str(e)}"
    
    async def post_to_instagram(self, content: str, file_path: Optional[str] = None, file_type: Optional[str] = None) -> Tuple[bool, str]:
        """Post to Instagram"""
        if not self.instagram_token or not self.instagram_account_id:
            return False, "Instagram credentials not configured"
        
        try:
            if not file_path:
                return False, "Instagram requires media content"
            
            # Upload media first
            if file_type == "image":
                # Create container for image
                url = f"https://graph.facebook.com/v18.0/{self.instagram_account_id}/media"
                
                # Upload image to a temporary hosting service or use Facebook's media upload
                # For now, we'll simulate the process
                media_data = {
                    'image_url': f"https://yourdomain.com/{file_path}",  # This would be your uploaded file URL
                    'caption': content,
                    'access_token': self.instagram_token
                }
                
                response = requests.post(url, data=media_data)
                
                if response.status_code == 200:
                    container_id = response.json()['id']
                    
                    # Publish the container
                    publish_url = f"https://graph.facebook.com/v18.0/{self.instagram_account_id}/media_publish"
                    publish_data = {
                        'creation_id': container_id,
                        'access_token': self.instagram_token
                    }
                    
                    publish_response = requests.post(publish_url, data=publish_data)
                    
                    if publish_response.status_code == 200:
                        return True, "Posted successfully to Instagram"
                    else:
                        return False, f"Instagram publish failed: {publish_response.json()}"
                else:
                    return False, f"Instagram media upload failed: {response.json()}"
            else:
                return False, "Video posting to Instagram not implemented yet"
                
        except Exception as e:
            return False, f"Instagram posting failed: {str(e)}"
    
    async def post_to_youtube(self, content: str, file_path: Optional[str] = None, file_type: Optional[str] = None) -> Tuple[bool, str]:
        """Post to YouTube"""
        if not self.youtube_api_key:
            return False, "YouTube credentials not configured"
        
        try:
            if not file_path or file_type != "video":
                return False, "YouTube requires video content"
            
            # YouTube posting requires OAuth2 and is more complex
            # For now, we'll return a placeholder implementation
            return False, "YouTube video upload requires OAuth2 implementation"
            
        except Exception as e:
            return False, f"YouTube posting failed: {str(e)}"
    
    async def post_to_tiktok(self, content: str, file_path: Optional[str] = None, file_type: Optional[str] = None) -> Tuple[bool, str]:
        """Post to TikTok"""
        if not self.tiktok_access_token:
            return False, "TikTok credentials not configured"
        
        try:
            if not file_path or file_type != "video":
                return False, "TikTok requires video content"
            
            # TikTok Business API implementation
            url = "https://business-api.tiktok.com/open_api/v1.3/tt_video/upload/"
            
            headers = {
                'Access-Token': self.tiktok_access_token,
            }
            
            # This is a simplified implementation
            # Actual TikTok API requires more complex authentication and file handling
            return False, "TikTok video upload requires business API setup"
            
        except Exception as e:
            return False, f"TikTok posting failed: {str(e)}"
