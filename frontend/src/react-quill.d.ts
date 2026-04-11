declare module 'react-quill' {
  import * as React from 'react';
  interface ReactQuillProps {
    value?: string;
    defaultValue?: string;
    readOnly?: boolean;
    theme?: string;
    modules?: any;
    formats?: string[];
    bounds?: string | HTMLElement;
    placeholder?: string;
    preserveWhitespace?: boolean;
    className?: string;
    onChange?: (content: string, delta: any, source: string, editor: any) => void;
    onChangeSelection?: (range: any, source: string, editor: any) => void;
    children?: React.ReactElement<any>;
  }
  export default class ReactQuill extends React.Component<ReactQuillProps> {}
}
