import { useEffect, useState } from 'react';
import moment from 'moment';
import Api, { endpoints } from '@Helpers/api';
// import queryString from 'query-string';
import { useParams, useHistory } from 'react-router-dom';

export default ({ user }) => {
  const isOrgUnlimited = !!user?.['Organization.StoreStorage.is_token_unlimited'];
  const radios_options = [
    { label: '3D Point Cloud in Potree Format (.zip contains .html file)', type: '3d', media_type: 'potree', value: 1, acceptedType: 'potree' },
    { label: 'Web 3D Mesh generated using ContextCapture (.zip contains App/Scene Directory)', type: '3d', media_type: '3d', value: 2, acceptedType: 'potree' },
    { label: '.las (require conversion)', type: '3d', media_type: 'point-clouds', value: 3, hasIcon: true, payment_needed: isOrgUnlimited ? 0 : 1, acceptedType: 'las', require_conversion: true },
  ];
  const history = useHistory();
  const { AssetId } = useParams();
  const [asset, setAsset] = useState();
  const [phases, setPhases] = useState([]);
  const [filteredPhases, setFilteredPhases] = useState([]);
  const [category, setCategory] = useState();
  // const { payment_intent, payment_processed } = queryString.parse(window.location.search);
  const [intents, setIntents] = useState();
  const [payment_id_override, setpayment_id_override] = useState(null);
  const [paymentGatewayReady, setPaymentGatewayReady] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [imageryName, setImageryName] = useState('');
  const [dateProgress, setDateProgress] = useState(moment().format('YYYY-MM-DD'));
  const [files, setFiles] = useState([]);
  const [mega_bytes, setMB] = useState([]);
  const [image_type_tab, set_image_type_tab] = useState('0');
  const [outputType, setOutputType] = useState();
  const [uploadPercentages, setUploadPercentages] = useState([0]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [securepayReady, setSecurepayReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep = () => { setActiveStep((prev) => prev + 1); };
  const handleBackStep = () => { setActiveStep((prev) => prev - 1); };
  const validatePayment = (pid, interval) => {
    Api({
      endpoint: endpoints.getPayment(pid),
      data: { type: 'rcoin' },
      onSuccess: ({ payment_process }) => {
        console.log('vvv validate payment', payment_process);
        if (['succeeded', 'failed'].includes(payment_process.status)) {
          clearInterval(interval);
          setIsPaymentLoading(false);
          setIntents({ status: payment_process.status });
          if (payment_process.status === 'succeeded') UploadFilesNow();
        }
      },
      onFail: () => console.log('lol'),
    });
  };
  const paymentCallback = (paymentModel) => {
    console.log('MMM', { PaymentId: paymentModel.id });
    setPaymentGatewayReady(true);
  };
  const UploadFilesNow = () => {
    if (!files.length) return;
    setUploadPercentages([...Array(files.length)].map(() => 0));
    const { type, media_type, require_conversion = false } = radios_options.find(x => x.value === outputType);
    files.forEach((file, idx) => {
      const xhr = Api({
        endpoint: endpoints.newAssetFile(),
        data: {
          label: imageryName,
          AssetId,
          type,
          media_type,
          ProjectPhaseId: category,
          require_conversion,
        },
        files: [file],
        uploadPercent: (p) => updatePercentage(idx, p),
        onSuccess: () => {
          toast('success', `${file.name} uploaded`);
          updatePercentage(idx, 'done');
          // redirect immediately when no payment happend
          history.push(`/asset/${AssetId}`);
          // window.location.reload(true);
        },
        onFail: () => {
          toast('error', 'Something went wrong, please try again.');
          handleNextStep();
        },
      });
      setUploadFiles(prev => [...prev, xhr]);
    });
  };

  const updatePercentage = (i, p) => {
    if (p === 100) p = 99;
    if (p === 'done') p = 100;
    setUploadPercentages(arr => { arr[i] = p; return [...arr]; });
  };

  useEffect(() => {
    setUploadPercentages([...Array(files.length)].map(() => 0));
  }, [files]);
  const getAssetPhase = (id) => {
    setIsLoading(true);
    Api({
      endpoint: endpoints.showAssets(id),
      onSuccess: ({ data }) => setAsset(data),
      onFail: () => toast('error', 'Error getting assets data. Please try again later.'),
    });
    Api({
      endpoint: endpoints.getStaticData(),
      onSuccess: ({ data }) => {
        setPhases(data.projectphase);
      },
      onFail: (err) => toast('error', err),
    });
  };
  useEffect(() => {
    getAssetPhase(AssetId);
  }, [AssetId]);
  useEffect(() => {
    if (!asset?.id) return;
    if (!phases.length) return;
    setFilteredPhases(phases.filter(p => asset.selectedPhase.split(',').map(x => Number(x)).includes(p.id)));
    setIsLoading(false);
  }, [asset, phases]);
  useEffect(async () => {
    if (!files.length) return;
    const mb = [];
    for (let fidx = 0; fidx < files.length; fidx++) {
      const f = files[fidx];
      mb.push(f.size / 1024 / 1024);
    }
    setMB(mb);
  }, [files]);
  useEffect(() => {
    if (!payment_id_override) return;
    console.log('vvv set timeout registered', payment_id_override);
    const interval = setInterval(() => {
      validatePayment(payment_id_override, interval);
      console.log('vvv checking payment status');
    }, 3000);
    return () => clearInterval(interval);
  }, [payment_id_override]);

  useEffect(() => {
    if (activeStep == 2) setFiles([]);
  }, [activeStep]);

  return {
    isPaymentLoading,
    setIsPaymentLoading,
    AssetId,
    filteredPhases,
    category,
    setCategory,
    radios_options,
    activeStep,
    setActiveStep,
    handleNextStep,
    handleBackStep,
    imageryName,
    setImageryName,
    dateProgress,
    setDateProgress,
    files,
    setFiles,
    mega_bytes,
    image_type_tab,
    set_image_type_tab,
    outputType,
    setOutputType,
    uploadPercentages,
    intents,
    paymentCallback,
    uploadFiles,
    UploadFilesNow,
    isOrgUnlimited,
    setpayment_id_override,
    paymentGatewayReady,
    setPaymentGatewayReady,
    securepayReady,
    setSecurepayReady,
    isLoading,
  };
};
