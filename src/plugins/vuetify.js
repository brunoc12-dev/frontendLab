import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';


const lightTheme = {
    dark:false,
    colors:{
        primary:'#6750A4',
        secondary:'#625B71',
        accent:'#7D5260',
        error:'#B3261E',
        info:'#2196F3',
        success:'#4CAF50',
        warning:'#FFC107',
        cardColor:'#FEF7FF'
    }
}


const darkTheme = {
    dark:true,
    colors:{
        primary:'#2196F3',
        secondary:'#757575',
        accent:'#FF4081',
        error:'#FF5252',
        info:'#2196F3',
        success:'#4CAF50',
        warning:'#FB8C00',
        cardColor:'#FEF7FF'
    }
}

export default createVuetify({
    components,
    directives,
    theme:{
        defaultTheme:'lightTheme',
        themes:{
            lightTheme,
            darkTheme
        }
    }
});