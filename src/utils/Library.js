import React from 'react';
import { TextBox, Button } from 'devextreme-react';

export function FieldCtrl(props) {
    const fields = props.info.map((info, i) => (
        <FieldDetail
            key={i}
            info={info}
        />
    ));

    return (
        <div className="dx-field">
            {fields}
        </div>
    );
}

export function FieldDetail(props) {
    if (props.info.fieldType === 'label') {
        return (
            <div className="dx-field-label">
                <Controls info={props.info} />
            </div>
        );
    }
    else {
        return (
            <div className="dx-field-value">
                <Controls info={props.info} />
            </div>
        );
    }
}

export function Controls(props) {
    switch (props.info.controlType) {
        case 'TextBox':
            return (
                <TextBox
                    defaultValue={props.info.defaultValue}
                    readOnly={props.info.readOnly}
                    value={props.info.text}
                    onKeyDown={props.info.KeyDown}
                />
            );
        case 'Button':
            return (
                <Button
                    text={props.info.text}
                    onClick={props.info.Onclick}
                />
            );
        default:
            return (props.info.text);
    }
}

/*
const Controls = (props) =>{
    switch (props.type) {
        case 'textBox':
            return(
                <TextBox
                    key = {props.key}
                    readOnly={true}
                    value = {props.value}
                />
            );
        default:
            return null;
    }
}
*/