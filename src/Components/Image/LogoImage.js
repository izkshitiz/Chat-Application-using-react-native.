import React from 'react';
import{Image,View} from 'react-native';

const LogoImage = (props) => {
return (
<View>
<Image style={{width:100,height:100}} source={require('../../../assets/Images/login.jpg')}/>
</View>   );
}
export default LogoImage;