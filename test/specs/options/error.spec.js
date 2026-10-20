describe('error', () => {
  it('should be `null` be default', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      const compressor = new Compressor(image);

      expect(compressor.options.error).to.be.null;
      done();
    });
  });

  it('should execute the `error` hook function', (done) => {
    const compressor = new Compressor(null, {
      error(error) {
        expect(error).to.be.an.instanceOf(Error);
        setTimeout(() => {
          expect(this).to.equal(compressor);
          done();
        });
      },
    });

    expect(compressor.options.error).to.be.a('function');
  });

  it('should throw error directly without a `error` hook function', () => {
    expect(() => {
      new Compressor(null);
    }).to.throw();
  });

  it('should execute the `error` hook function when the canvas exceeds the size limit', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.png', (image) => {
      new Compressor(image, {
        // Exceeds the maximum canvas area of the browser
        width: 40000,
        height: 40000,
        resize: 'cover',
        success() {
          done(new Error('Expected the `error` hook function to be executed.'));
        },
        error(error) {
          expect(error).to.be.an.instanceOf(Error);
          done();
        },
      });
    });
  });
});
