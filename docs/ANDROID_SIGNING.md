Android signing guide (sample snippets)

Do NOT commit your keystore to version control.

1) Create a release key (if you don't have one):

keytool -genkeypair -v -keystore release-keystore.jks -alias goaltree-key -keyalg RSA -keysize 2048 -validity 10000

2) Sample `gradle.properties` (store locally - do not commit):

RELEASE_STORE_FILE=release-keystore.jks
RELEASE_KEY_ALIAS=goaltree-key
RELEASE_STORE_PASSWORD=your_store_password
RELEASE_KEY_PASSWORD=your_key_password

3) `app/build.gradle` (snippet) to add signingConfig:

android {
  signingConfigs {
    release {
      storeFile file(RELEASE_STORE_FILE)
      storePassword RELEASE_STORE_PASSWORD
      keyAlias RELEASE_KEY_ALIAS
      keyPassword RELEASE_KEY_PASSWORD
    }
  }
  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled false
      // proguard settings if needed
    }
  }
}

4) Build signed bundle via Gradle wrapper:

On Windows PowerShell (in android project directory):

.\gradlew.bat bundleRelease

or to build debug bundle (for testing):

.\gradlew.bat bundleDebug

5) Use Android Studio UI: Build > Generate Signed Bundle / APK (recommended if unfamiliar with Gradle commands)

Notes:
- For Play App Signing, you can opt in to let Google manage the app signing key. If so, upload your "upload key" signed AAB instead.
- Keep the keystore and its passwords secure. Use a secrets manager for CI/CD.
