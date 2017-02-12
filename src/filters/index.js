import moment from 'moment'

export function host (url) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const parts = host.split('.').slice(-3)
  if (parts[0] === 'www') parts.shift()
  return parts.join('.')
}

export function memory(bytes) {
  var sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
  if(!bytes && bytes !== 0) {
    return "0 B";
  }
  for(var i = sizes.length; i > 0; i--) {
    var step = Math.pow(1024, i);
    if (bytes >= step) {
      return (bytes / step).toFixed(2) + " " + sizes[i];
    }
  }
  return bytes + " B";
}

export function uptime(date) {
 return moment.duration(date, "seconds").humanize()
}

export function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + 'Y';
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + 'M';
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + 'D';
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + 'h';
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + 'm';
  }
  return Math.floor(seconds) + 's';
}

export function timeAgo (time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export function formatUnix (value) {
  return moment.unix(value).format("YYYY MM DD hh:mm:ss");
}

export function timestampParse(timestamp) {
  let date = new Date(timestamp)
  return moment(date).format("YYYY MM DD hh:mm:ss");
}

function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}
