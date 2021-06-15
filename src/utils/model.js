
//필드정보
export function Field(fieldType, controlType, key, defaultValue, readOnly = true, text, onKeydown, onClick){
    this.fieldType = fieldType;
    this.controlType = controlType;
    this.key = key;
    this.defaultValue = defaultValue;
    this.readOnly = readOnly;
    this.text = text;
    this.onKeydown = onKeydown;
    this.onClick = onClick;
}

// //팝업정보
// export function PopupInfo(title, date, gridKey, view){
//     this.title = title;
//     this.date = date;
//     this.gridKey = gridKey;
//     this.view = view;
// }

//팝업정보
export function PopupInfo(title, key, view, column){
    this.title = title;
    this.key = key;
    this.view = view;
    this.column = column;
}