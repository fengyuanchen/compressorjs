describe('resize', () => {
  describe('none', () => {
    it('should be "none" by default', (done) => {
      window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
        const compressor = new Compressor(image);

        expect(compressor.options.resize).to.equal('none');
        done();
      });
    });
  });

  describe('contain', () => {
    it('should be "contain"', (done) => {
      window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
        const compressor = new Compressor(image, {
          resize: 'contain',
        });

        expect(compressor.options.resize).to.equal('contain');
        done();
      });
    });

    describe('maxWidth/Height', () => {
      it('should not greater than the given maximum width', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            maxWidth: 100,
            resize: 'contain',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalWidth).to.lessThanOrEqual(100);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });

      it('should not greater than the given maximum height', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            maxHeight: 100,
            resize: 'contain',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalHeight).to.lessThanOrEqual(100);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });

      it('should not greater than both the given maximum width and height', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            maxWidth: 100,
            maxHeight: 100,
            resize: 'contain',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalWidth).to.lessThanOrEqual(100);
                expect(newImage.naturalHeight).to.lessThanOrEqual(100);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });
    });

    describe('minWidth/Height', () => {
      it('should not less than the given minimum width', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            minWidth: 1000,
            resize: 'contain',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalWidth).to.greaterThanOrEqual(1000);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });

      it('should not less than the given minimum height', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            minHeight: 1000,
            resize: 'contain',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalHeight).to.greaterThanOrEqual(1000);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });

      it('should not less than both the given minimum width and height', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            minWidth: 1000,
            minHeight: 1000,
            resize: 'contain',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalWidth).to.greaterThanOrEqual(1000);
                expect(newImage.naturalHeight).to.greaterThanOrEqual(1000);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });
    });

    describe('width/Height', () => {
      it('should be ignore when only the `width` option is set', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            width: 1000,
            resize: 'contain',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalWidth).to.equal(1000);
                expect(newImage.naturalHeight).to.equal(1200);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });

      it('should be ignore when only the `height` option is set', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            height: 1000,
            resize: 'contain',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalWidth).to.equal(833);
                expect(newImage.naturalHeight).to.equal(1000);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });

      it('should equal to both the given width and height', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            width: 1000,
            height: 1000,
            resize: 'contain',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalWidth).to.equal(1000);
                expect(newImage.naturalHeight).to.equal(1000);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });
    });
  });

  describe('cover', () => {
    it('should be "cover"', (done) => {
      window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
        const compressor = new Compressor(image, {
          resize: 'cover',
        });

        expect(compressor.options.resize).to.equal('cover');
        done();
      });
    });

    describe('maxWidth/Height', () => {
      it('should not greater than the given maximum width', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            maxWidth: 100,
            resize: 'cover',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalWidth).to.lessThanOrEqual(100);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });

      it('should not greater than the given maximum height', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            maxHeight: 100,
            resize: 'cover',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalHeight).to.lessThanOrEqual(100);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });

      it('should not greater than both the given maximum width and height', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            maxWidth: 100,
            maxHeight: 100,
            resize: 'cover',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalWidth).to.lessThanOrEqual(100);
                expect(newImage.naturalHeight).to.lessThanOrEqual(100);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });
    });

    describe('minWidth/Height', () => {
      it('should not less than the given minimum width', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            minWidth: 1000,
            resize: 'cover',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalWidth).to.greaterThanOrEqual(1000);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });

      it('should not less than the given minimum height', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            minHeight: 1000,
            resize: 'cover',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalHeight).to.greaterThanOrEqual(1000);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });

      it('should not less than both the given minimum width and height', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            minWidth: 1000,
            minHeight: 1000,
            resize: 'cover',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalWidth).to.greaterThanOrEqual(1000);
                expect(newImage.naturalHeight).to.greaterThanOrEqual(1000);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });
    });

    describe('width/Height', () => {
      it('should be ignore when only the `width` option is set', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            width: 1000,
            resize: 'cover',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalWidth).to.equal(1000);
                expect(newImage.naturalHeight).to.equal(1200);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });

      it('should be ignore when only the `height` option is set', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            height: 1000,
            resize: 'cover',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalWidth).to.equal(833);
                expect(newImage.naturalHeight).to.equal(1000);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });

      it('should equal to both the given width and height', (done) => {
        window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
          new Compressor(image, {
            width: 1000,
            height: 1000,
            resize: 'cover',
            success(result) {
              const newImage = new Image();

              newImage.onload = () => {
                expect(newImage.naturalWidth).to.equal(1000);
                expect(newImage.naturalHeight).to.equal(1000);
                done();
              };
              newImage.src = URL.createObjectURL(result);
            },
          });
        });
      });
    });
  });
});
