/**
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

package com.phonegap.plugin.mobileaccessibility;

import com.phonegap.plugin.mobileaccessibility.MobileAccessibility;

import android.annotation.TargetApi;
import android.os.Build;
import android.view.accessibility.AccessibilityEvent;
import android.webkit.WebView;

import java.lang.IllegalAccessException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

@TargetApi(Build.VERSION_CODES.JELLY_BEAN)
public class JellyBeanMobileAccessibilityHelper extends
        IceCreamSandwichMobileAccessibilityHelper {

    @Override
    public void initialize(MobileAccessibility mobileAccessibility) {
        WebView view;
        super.initialize(mobileAccessibility);

        try {
            view = (WebView) mobileAccessibility.webView;
            mParent = view.getParentForAccessibility();
        } catch(ClassCastException ce) {  // cordova-android 4.0+
            try {
                Method getView = mobileAccessibility.webView.getClass().getMethod("getView");
                view = (WebView) getView.invoke(mobileAccessibility.webView);
                mParent = view.getParentForAccessibility();
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }

    }

    @Override
    public void announceForAccessibility(CharSequence text) {
        if (mAccessibilityManager.isEnabled() && mParent != null) {
            mAccessibilityManager.interrupt();
            AccessibilityEvent event = AccessibilityEvent.obtain(
                    AccessibilityEvent.TYPE_ANNOUNCEMENT);
            mWebView.onInitializeAccessibilityEvent(event);
            event.getText().add(text);
            event.setContentDescription(null);
            mParent.requestSendAccessibilityEvent(mWebView, event);
        }
    }
}
