const API_KEY = "AIzaSyBZLvAAhh3UVyOE_wuN4VVsZbH_4jsR-zs";
const channelsContainer = document.getElementById('channels');
const loadingSpinner = document.querySelector('.loading-spinner');

// تابع برای خواندن داده‌ها از فایل JSON
async function fetchChannels() {
  try {
    const response = await fetch('channels.json');
    if (!response.ok) throw new Error("Failed to fetch channels.json");
    return await response.json();
  } catch (error) {
    console.error("Error fetching channels:", error);
    return [];
  }
}

// تابع برای گرفتن اطلاعات کانال
async function getChannelInfo(handle) {
  try {
    const detailsUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,topicDetails&forUsername=${handle}&key=${API_KEY}`;
    const response = await fetch(detailsUrl);

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items[0];
    }
    console.error(`Channel not found for handle: ${handle}`);
    return null;
  } catch (error) {
    console.error(`Error fetching channel info for ${handle}:`, error);
    return null;
  }
}

// تابع برای ساخت کارت کانال
function createChannelCard(channel) {
  const { title, description, thumbnails, publishedAt, country } = channel.snippet;
  const { subscriberCount, viewCount, videoCount } = channel.statistics;
  const topics = channel.topicDetails?.topicCategories || [];
  
  const creationYear = new Date(publishedAt).getFullYear();
  const topicList = topics.map(topic => topic.split('/').pop().replace(/_/g, ' ')).join(', ') || 'Unknown';
  const channelLink = `https://www.youtube.com/channel/${channel.id}`;

  return `
    <div class="col-md-4">
      <div class="channel-card text-center p-3 border rounded">
        <img src="${thumbnails.default.url}" alt="${title}" class="rounded-circle">
        <div class="channel-title mt-3 font-weight-bold">${title}</div>
        <div class="channel-description small mt-2 text-muted">${description || 'No description available'}</div>
        <div class="channel-stats mt-3">
          <strong>Subscribers:</strong> ${subscriberCount.toLocaleString()}<br>
          <strong>Views:</strong> ${viewCount.toLocaleString()}<br>
          <strong>Videos:</strong> ${videoCount.toLocaleString()}<br>
          <strong>Created:</strong> ${creationYear}<br>
          <strong>Country:</strong> ${country || 'Unknown'}<br>
          <strong>Topics:</strong> ${topicList}
        </div>
        <a href="${channelLink}" target="_blank" class="btn btn-primary mt-3">Visit Channel</a>
      </div>
    </div>
  `;
}

// تابع برای نمایش اطلاعات کانال‌ها
async function displayChannels() {
  try {
    loadingSpinner.style.display = 'block';
    const channelHandles = await fetchChannels();

    if (channelHandles.length === 0) {
      channelsContainer.innerHTML = '<p class="text-center text-danger">No channels found.</p>';
      return;
    }

    for (const handle of channelHandles) {
      const channel = await getChannelInfo(handle);
      if (channel) {
        channelsContainer.innerHTML += createChannelCard(channel);
      }
    }
  } catch (error) {
    console.error("Error displaying channels:", error);
    channelsContainer.innerHTML = '<p class="text-center text-danger">Failed to load channels.</p>';
  } finally {
    loadingSpinner.style.display = 'none';
  }
}

// شروع فرآیند
displayChannels();