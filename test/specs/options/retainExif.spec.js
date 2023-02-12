import { getExif } from '../../../src/utilities';

function blobToArrayBuffer(blob, callback) {
  const reader = new FileReader();

  reader.onload = ({ target }) => {
    callback(target.result);
  };
  reader.readAsArrayBuffer(blob);
}

describe('retainExif', () => {
  it('should not retain the Exif information', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
        success(result) {
          blobToArrayBuffer(result, (arrayBuffer) => {
            expect(getExif(arrayBuffer)).to.be.empty;
            done();
          });
        },
      });
    });
  });

  it('should retain the Exif information', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      new Compressor(image, {
        retainExif: true,
        success(result) {
          blobToArrayBuffer(result, (arrayBuffer) => {
            expect(getExif(arrayBuffer)).not.to.be.empty;
            done();
          });
        },
      });
    });
  });
});
