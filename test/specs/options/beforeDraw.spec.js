describe('beforeDraw', () => {
  it('should be `null` be default', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      const compressor = new Compressor(image);

      expect(compressor.options.beforeDraw).to.be.null;
      done();
    });
  });

  it('should execute the `beforeDraw` hook function', (done) => {
    window.loadImageAsBlob('/base/docs/images/picture.jpg', (image) => {
      const compressor = new Compressor(image, {
        beforeDraw(context, canvas) {
          expect(this).to.equal(compressor);
          expect(context).to.be.an.instanceOf(CanvasRenderingContext2D);
          expect(canvas).to.be.an.instanceOf(HTMLCanvasElement);
          done();
        },
      });

      expect(compressor.options.beforeDraw).to.be.a('function');
    });
  });
});
