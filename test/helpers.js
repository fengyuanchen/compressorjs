window.loadImageAsBlob = (url, done) => {
  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    const blob = xhr.response;

    blob.name = url.replace(/^.*?(\w+\.\w+)$/, '$1');
    done(blob);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
};
