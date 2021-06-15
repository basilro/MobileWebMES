import {dicCommon} from './localization/dicCommon'
import {dicView} from './localization/dicView'

export default {
    //기본항목들
    getDictionary(){
        return dictionary;
    },
    //dev 기본제공번역
    getCommon(){
      return dicCommon;
    },
    //화면단 번역
    getView(){
      return dicView;
    }
};

const dictionary = {
    'en': {
      'Number': 'Number',
      'Company': 'Company',
      'footer': '© DNT Inc',
      'profile': 'Profile',
      'logout': 'Logout',
      'Korean': 'Korean',
      'English': 'English',
      'langs': [{name : 'Korean', value : 'ko'}, {name : 'English', value : 'en'}],
      'auth': [
        {name : '', value: ''},
        {name : 'Admin', value: 'MASTER'},
        {name : 'Manager', value: 'MANAGER'},
        {name : 'Worker', value: 'WORKER'}
      ],
      'selectOption': [ 
        {name : '', value: ''},
        {name : 'YES', value: 'Y'},
        {name : 'NO', value: 'N'}
      ]
    },
    'ko': {
      'Number': '번호',
      'Company': '회사',
      'footer': '(주)디앤티',
      'profile': '내 정보',
      'logout': '로그아웃',
      'Korean': '한국어',
      'English': '영어',
      'langs': [{name : '한국어', value : 'ko'}, {name : '영어', value : 'en'}],
      'auth': [
        {name : '', value: ''},
        {name : '관리자', value: 'MASTER'},
        {name : '매니저', value: 'MANAGER'},
        {name : '작업자', value: 'WORKER'}
      ],
      'selectOption': [ 
        {name : '', value: ''},
        {name : '예', value: 'Y'},
        {name : '아니오', value: 'N'}
      ]
    }
  };