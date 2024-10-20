// import { useEffect, useRef, useState } from 'react';

// import JSONEditor, { JSONEditorMode } from 'jsoneditor';
// import 'jsoneditor/dist/jsoneditor.css';
// import { DMMF } from '@repo/database';
// import FieldLabel from '../FieldLabel';

// interface Props {
//   field: AdminModelField;
//   attributeType: AdminAttributeType;
//   value: string;
//   onChange: (key: string, value: any) => void;
// }
// export default function JsonField({ field, value, onChange }: Props) {
//   const [editor, setEditor] = useState<JSONEditor | null>(null);
//   const container = useRef(null);

//   const handleChange = (json: any) => {
//     onChange(field.name, json);
//   };

//   useEffect(() => {
//     function initEditor() {
//       if (container.current) {
//         // @see https://github.com/josdejong/jsoneditor/blob/master/docs/api.md
//         const options = {
//           mode: 'tree' as JSONEditorMode,
//           onChangeJSON: handleChange,
//           sortObjectKeys: false,
//           enableSort: false,
//           limitDragging: true,
//           history: false,
//           search: false,
//           indentation: 2,
//           mainMenuBar: false,
//           navigationBar: false,
//           statusBar: false,
//           language: 'en',
//         };

//         const jsoneditor = new JSONEditor(container.current, options, value);

//         setEditor(jsoneditor);
//       }
//     }

//     initEditor();

//     return () => {
//       if (editor) {
//         editor.destroy();
//       }
//     };
//   }, [container]);

//   return (
//     <div>
//       <FieldLabel field={field} />
//       <div className="jsoneditor-react-container w-100 h-100" ref={container} />
//     </div>
//   );
// }
