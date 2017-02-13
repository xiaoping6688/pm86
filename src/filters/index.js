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

export function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}


export function cookie(name){    
 
   var cookieArray=document.cookie.split("; "); //得到分割的cookie名值对    
 
   var cookie=new Object();    
 
   for (var i=0;i<cookieArray.length;i++){    
 
      var arr=cookieArray[i].split("=");       //将名和值分开    
 
      if(arr[0]==name)return unescape(arr[1]); //如果是指定的cookie，则返回它的值    
 
   } 
 
   return ""; 
 
} 
 
  
 
export function delCookie(name)//删除cookie
 
{
 
   document.cookie = name+"=;expires="+(new Date(0)).toGMTString();
 
}
 
  
 
export function getCookie(objName){//获取指定名称的cookie的值
 
    var arrStr = document.cookie.split("; ");
 
    for(var i = 0;i < arrStr.length;i ++){
 
        var temp = arrStr[i].split("=");
 
        if(temp[0] == objName) return unescape(temp[1]);
 
   } 
 
}
 
  
 
function addCookie(objName,objValue,objHours){      //添加cookie
 
    var str = objName + "=" + escape(objValue);
 
    if(objHours > 0){                               //为时不设定过期时间，浏览器关闭时cookie自动消失
 
        var date = new Date();
 
        var ms = objHours*3600*1000;
 
        date.setTime(date.getTime() + ms);
 
        str += "; expires=" + date.toGMTString();
 
   }
 
   document.cookie = str;
 
}
