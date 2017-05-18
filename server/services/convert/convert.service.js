const exec = require('child-process-promise').exec;
const tmp = require('tmp');

const convert = (filetype, outdir, file) => {
  const cmd = `/usr/bin/libreoffice --headless --convert-to ${filetype} --outdir "${outdir}" "${file}"`

}
