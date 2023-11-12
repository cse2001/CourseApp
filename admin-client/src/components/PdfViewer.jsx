import { Document, Page, pdfjs  } from 'react-pdf';
import {Viewer, Worker } from '@react-pdf-viewer/core';

import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { SpecialZoomLevel } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();


export function PdfViewer({fileContent}) {
  const newplugin = defaultLayoutPlugin();
  let workerurl = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).toString()

  return <div>
  { 
    <Worker workerUrl= {workerurl} >
      <div style={{ width: '900px', height: '800px', overflow: 'auto' }}>
        <Viewer fileUrl={fileContent} plugins={[newplugin]}  />
      </div>
    </Worker>      
  }
  </div>
}