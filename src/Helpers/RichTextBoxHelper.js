import {RichTextEditor} from '@mantine/rte';
import DOMPurify from 'dompurify';
export default function RichTextBoxHelper({value, onChange}) {
    function handleOnChange(value) {
        const sanitizeValue = DOMPurify.sanitize(value);
        onChange(sanitizeValue);
    }

    return <div className="h-64"><RichTextEditor
        controls={[
        ['bold', 'italic', 'underline', 'link'],
        ['unorderedList', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        ['sup', 'sub'],
        ['alignLeft', 'alignCenter', 'alignRight'],
    ]} value={value} onChange={handleOnChange} className="h-64 overflow-auto"/></div>;
}