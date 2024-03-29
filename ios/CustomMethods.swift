//
//  CustomMethods.swift
//  PaletteWall
//
//  Created by LeshLiao on 2024-03-29.
//

import Foundation
import React
import Photos

@objc(CustomMethods)
class CustomMethods: NSObject, RCTBridgeModule {

    static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc
    func MyMethod(_ param: String) {
        print("ios message:")
        print(param)
    }

    @objc
    static func moduleName() -> String {
        return "CustomMethods"
    }

    @objc
    func combineImage(_ imageUrl: String, videoUrl: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
      guard let imageURL = URL(string: imageUrl), let videoURL = URL(string: videoUrl) else {
        rejecter("INVALID_URL", "Invalid image or video URL", nil)
        return
      }
      print("ios combineImage()")
      PHPhotoLibrary.shared().performChanges({
        let request = PHAssetCreationRequest.forAsset()
        request.addResource(with: .photo, fileURL: imageURL, options: nil)
        request.addResource(with: .pairedVideo, fileURL: videoURL, options: nil)
      }) { success, error in
        if success {
          resolver("Live photo created successfully")
        } else {
          rejecter("CREATE_FAILED", "Failed to create live photo: \(error?.localizedDescription ?? "Unknown error")", error)
        }
      }
    }
}
