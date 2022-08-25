import { Fragment, useEffect, useRef, useState } from 'react';
import { Controller } from "react-hook-form";

const Editor = ({ state, error, name, control, ...rest }) => {
    const editorRef = useRef()
    const [editorLoaded, setEditorLoaded] = useState(false)
    const { CKEditor, ClassicEditor } = editorRef.current || {}
    const [data, setData] = state

    useEffect(() => {
        editorRef.current = {
            CKEditor: require('@ckeditor/ckeditor5-react').CKEditor, //Added .CKEditor
            ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
        }
        setEditorLoaded(true)
    }, []);

    return (
        <Fragment>
            {editorLoaded ?
                <Fragment>
                    <Controller
                        control={control}
                        name={name}
                        {...rest}
                        render={({ field }) => (
                            <CKEditor
                                editor={ClassicEditor}
                                data={data}
                                onChange={(event, editor) => {
                                    const data = editor.getData()
                                    setData(data);
                                }}
                            />
                        )}
                    />
                    {error && (
                        <p class="my-2 text-xs text-start text-red-500">{error}</p>
                    )}
                </Fragment>
                : <p>Carregando...</p>}
        </Fragment>
    )
}

export default Editor