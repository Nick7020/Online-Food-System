import os
import requests
from urllib.parse import urlparse

def download_image(url, filename):
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Downloaded: {filename}")
        return True
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return False

# Create images directory if it doesn't exist
os.makedirs('images', exist_ok=True)

# List of image URLs to download
image_urls = [
    # Hero image
    "https://images.unsplash.com/photo-1504674900247-0877039348bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    
    # Category images
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    
    # Food item images
    "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    
    # Testimonial avatar
    "https://randomuser.me/api/portraits/women/32.jpg",
    
    # Mobile app image
    "https://www.freepngimg.com/thumb/smartphone/67060-phone-mobile-app-android-google-play-store.png"
]

# Download all images
for i, url in enumerate(image_urls):
    # Extract filename from URL or use a numbered filename
    parsed_url = urlparse(url)
    filename = os.path.basename(parsed_url.path)
    if not filename or '.' not in filename:
        filename = f"image_{i+1}.jpg"
    
    # Save in images directory
    filepath = os.path.join('images', filename)
    
    # Only download if file doesn't exist
    if not os.path.exists(filepath):
        download_image(url, filepath)
    else:
        print(f"File already exists: {filepath}")

print("\nImage download complete!")
