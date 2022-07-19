import Button from '@Components/Button';
import Dropzone from '@Components/DropzoneBox/v2';

export default (h) => {
  const { maxSize } = h.radio_options.find(x => x.value === h.outputType);
  return (
    <div className="w-75 mx-auto">
      <Dropzone type="vectornraster" files={h.files} setFiles={h.setFiles} height="50vh" hasButton={false} maxFiles={1} maxSize={maxSize} />
      <div className="mt-5 d-flex justify-content-between">
        <p><span className="color-disabled">Total images to uploads:</span> {h.files.length.toLocaleString()}</p>
        <div>
          <Button variant="text" onClick={h.handleBackStep}>
            PREVIOUS
          </Button>
          <Button onClick={h.handleNextStep} disabled={!h.files.length}>
            NEXT
          </Button>
        </div>
      </div>
    </div>
  );
};
