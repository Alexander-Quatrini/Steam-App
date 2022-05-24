export function getCookie(name: string): string{
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match)
    { 
        return decodeURIComponent(match[2].toString());
    }
    return "";
  }