package com.sbp;

import android.os.Bundle;

import com.facebook.react.ReactActivity;

//import org.devio.rn.splashscreen.SplashScreen;

/**
 *  Inits main activity object.
 *
 * @author  Spayker
 * @version 1.0
 * @since   06/01/2019
 */
public class MainActivity extends ReactActivity {

    /*@Override
    protected  void onCreate(Bundle savedInstanceState){
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);

    }*/

    @Override
    protected String getMainComponentName() {
        return "sbp";
    }
}
