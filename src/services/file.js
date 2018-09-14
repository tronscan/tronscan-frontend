export function downloadStringAsFile(contents, filename, mimetype = 'text/plain') {
  let a = window.document.createElement('a');
  a.href = window.URL.createObjectURL(new Blob([contents], {type: mimetype}));
  a.download = filename;

  // Append anchor to body.
  document.body.appendChild(a);
  a.click();

  // Remove anchor from body
  document.body.removeChild(a);
}

export function readFileContentsFromEvent(ev) {

  return new Promise(resolve => {
    let files = ev.target.files;

    const reader = new FileReader();
    reader.onload = (file) => {
      const contents = file.target.result;
      resolve(contents);
    };

    reader.readAsText(files[0]);
  });
}
