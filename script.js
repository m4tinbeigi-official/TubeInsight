const API_KEY = "AIzaSyBZLvAAhh3UVyOE_wuN4VVsZbH_4jsR-zs";
const channelsContainer = document.getElementById('channels');
const loadingSpinner = document.querySelector('.loading-spinner');

// تابع برای خواندن داده‌ها از فایل JSON
async function fetchChannels() {
  const response = await fetch('channels.json');
  return response.json();
}

// تابع برای گرفتن اطلاعات کانال
async function getChannelInfo(handle) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${handle}&key=${API_KEY}`;
  const searchResponse = await fetch(searchUrl);
  const searchData = await searchResponse.json();

  if (searchData.items && searchData.items.length > 0) {
    const channelId = searchData.items[0].id.channelId;

    const detailsUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`;
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (detailsData.items && detailsData.items.length > 0) {
      return detailsData.items[0];
    }
  }
  return null;
}

// تابع برای نمایش اطلاعات کانال‌ها
async function displayChannels() {
  loadingSpinner.style.display = 'block';

  const channelHandles = await fetchChannels();
  for (const handle of channelHandles) {
    const channel = await getChannelInfo(handle);
    if (channel) {
      const { title, thumbnails } = channel.snippet;
      const { subscriberCount, viewCount, videoCount } = channel.statistics;

      const channelCard = `
        <div class="col-md-4">
          <div class="channel-card text-center">
            <img src="${thumbnails.default.url}" alt="${title}">
            <div class="channel-title mt-3">${title}</div>
            <div class="channel-stats mt-2">
              Subscribers: ${subscriberCount.toLocaleString()}<br>
              Views: ${viewCount.toLocaleString()}<br>
              Videos: ${videoCount.toLocaleString()}
            </div>
          </div>
        </div>
      `;
      channelsContainer.innerHTML += channelCard;
    }
  }

  loadingSpinner.style.display = 'none';
}

displayChannels();
