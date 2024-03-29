//
//  CustomMethods.m
//  PaletteWall
//
//  Created by LeshLiao on 2024-03-29.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CustomMethods, NSObject)

RCT_EXTERN_METHOD(MyMethod : (NSString *) param)

RCT_EXTERN_METHOD(combineImage : (NSString *)imageUrl videoUrl:(NSString *)videoUrl resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)


@end
