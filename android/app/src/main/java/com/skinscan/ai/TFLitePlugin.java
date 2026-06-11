package com.skinscan.ai;

import android.content.res.AssetFileDescriptor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import org.json.JSONArray;
import org.tensorflow.lite.Interpreter;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.channels.FileChannel;

@CapacitorPlugin(name = "TFLite")
public class TFLitePlugin extends Plugin {
    private Interpreter tflite;
    private boolean isLoaded = false;
    private static final int IMG_SIZE = 224;

    @PluginMethod
    public void loadModel(PluginCall call) {
        try {
            if (isLoaded) {
                call.resolve();
                return;
            }
            AssetFileDescriptor fileDescriptor = getContext().getAssets().openFd("ml/model.tflite");
            FileInputStream inputStream = new FileInputStream(fileDescriptor.getFileDescriptor());
            FileChannel fileChannel = inputStream.getChannel();
            long startOffset = fileDescriptor.getStartOffset();
            long declaredLength = fileDescriptor.getDeclaredLength();
            ByteBuffer modelBuffer = fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength);
            
            Interpreter.Options options = new Interpreter.Options();
            tflite = new Interpreter(modelBuffer, options);
            isLoaded = true;
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to load model: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void classify(PluginCall call) {
        if (!isLoaded) {
            try {
                AssetFileDescriptor fileDescriptor = getContext().getAssets().openFd("ml/model.tflite");
                FileInputStream inputStream = new FileInputStream(fileDescriptor.getFileDescriptor());
                FileChannel fileChannel = inputStream.getChannel();
                long startOffset = fileDescriptor.getStartOffset();
                long declaredLength = fileDescriptor.getDeclaredLength();
                ByteBuffer modelBuffer = fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength);
                Interpreter.Options options = new Interpreter.Options();
                tflite = new Interpreter(modelBuffer, options);
                isLoaded = true;
            } catch (Exception e) {
                call.reject("Model not loaded and auto-load failed: " + e.getMessage());
                return;
            }
        }

        String base64Image = call.getString("imageBase64");
        if (base64Image == null) {
            call.reject("Missing imageBase64 parameter");
            return;
        }

        if (base64Image.contains(",")) {
            base64Image = base64Image.substring(base64Image.indexOf(",") + 1);
        }

        try {
            byte[] decodedString = Base64.decode(base64Image, Base64.DEFAULT);
            Bitmap bitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
            if (bitmap == null) {
                call.reject("Failed to decode base64 image");
                return;
            }

            if (bitmap.getWidth() != IMG_SIZE || bitmap.getHeight() != IMG_SIZE) {
                bitmap = Bitmap.createScaledBitmap(bitmap, IMG_SIZE, IMG_SIZE, true);
            }

            ByteBuffer imgData = ByteBuffer.allocateDirect(IMG_SIZE * IMG_SIZE * 3);
            imgData.order(ByteOrder.nativeOrder());

            int[] intValues = new int[IMG_SIZE * IMG_SIZE];
            bitmap.getPixels(intValues, 0, bitmap.getWidth(), 0, 0, bitmap.getWidth(), bitmap.getHeight());

            int pixel = 0;
            for (int i = 0; i < IMG_SIZE; ++i) {
                for (int j = 0; j < IMG_SIZE; ++j) {
                    final int val = intValues[pixel++];
                    byte r = (byte) ((val >> 16) & 0xFF);
                    byte g = (byte) ((val >> 8) & 0xFF);
                    byte b = (byte) (val & 0xFF);
                    imgData.put(r);
                    imgData.put(g);
                    imgData.put(b);
                }
            }

            byte[][] labelProbArray = new byte[1][23];
            tflite.run(imgData, labelProbArray);

            float scale = tflite.getOutputTensor(0).quantizationParams().getScale();
            int zeroPoint = tflite.getOutputTensor(0).quantizationParams().getZeroPoint();

            JSONArray probabilities = new JSONArray();
            for (int i = 0; i < 23; i++) {
                int rawVal = labelProbArray[0][i] & 0xFF;
                float dequantizedVal = (rawVal - zeroPoint) * scale;
                probabilities.put((double) dequantizedVal);
            }

            JSObject result = new JSObject();
            result.put("probabilities", probabilities);
            call.resolve(result);

        } catch (Exception e) {
            call.reject("Classification failed: " + e.getMessage(), e);
        }
    }
}
