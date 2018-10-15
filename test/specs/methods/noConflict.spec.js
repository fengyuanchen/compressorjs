describe('noConflict', () => {
  it('should be a static method', () => {
    expect(Compressor.noConflict).to.be.a('function');
  });

  it('should return the Compressor class itself', () => {
    const { Compressor } = window;
    const ImageCompressor = Compressor.noConflict();

    expect(ImageCompressor).to.equal(Compressor);
    expect(window.Compressor).to.be.undefined;

    // Reverts it for the rest test suites
    window.Compressor = ImageCompressor;
  });
});
