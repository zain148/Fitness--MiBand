package com.sbp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.hopding.pdflib.PDFLibPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.swmansion.rnscreens.RNScreensPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.sbp.common.ModuleStorage;
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;

import java.util.Arrays;
import java.util.List;

import static com.sbp.common.ModuleStorage.getModuleStorage;

/**
 *  Inits ReactNativeHost instance including registration of main native packages
 *
 * @author  Spayker
 * @version 1.0
 * @since   06/01/2019
 */
public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      ModuleStorage appModuleStorage = getModuleStorage();
      return Arrays.asList(
              new SvgPackage(),
              new RNHTMLtoPDFPackage(),
              appModuleStorage.getMainReactPackage(),
              appModuleStorage.getDeviceConnectorPackage(),
              appModuleStorage.getHeartBeatMeasurerPackage(),
              appModuleStorage.getInfoPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, false);
  }
}
