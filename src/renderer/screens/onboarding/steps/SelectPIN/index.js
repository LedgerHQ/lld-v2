// // @flow
// import React from "react";
// import { FixedTopContainer, Title } from "~/renderer/screens/onboarding";
// import { getDeviceModel } from "@ledgerhq/devices";
// import TrackPage from "~/renderer/analytics/TrackPage";
// import GrowScroll from "~/renderer/components/GrowScroll";
// import Box from "~/renderer/components/Box";
// import OnboardingFooter from "~/renderer/screens/onboarding/OnboardingFooter";
//
// const SelectPin = ({ modelId, restore = false }: { modelId: DeviceModelId, restore?: boolean }) => {
//   switch (modelId) {
//     case "nanoX":
//       return restore ? <SelectPINRestoreNanoX /> : <SelectPINnanoX />;
//     case "blue":
//       return restore ? <SelectPINrestoreBlue /> : <SelectPINblue />;
//     default:
//       return restore ? <SelectPINrestoreNano /> : <SelectPINnano />;
//   }
// };
//
// export default (props: StepProps) => {
//   const { nextStep, prevStep, t, onboarding } = props;
//
//   const model = getDeviceModel(onboarding.deviceModelId || "nanoS");
//
//   return (
//     <FixedTopContainer>
//       <GrowScroll pb={7}>
//         <TrackPage
//           category="Onboarding"
//           name="Choose PIN"
//           flowType={onboarding.flowType}
//           deviceType={model.productName}
//         />
//         {onboarding.flowType === "restoreDevice" ? (
//           <Box grow alignItems="center">
//             <Title>{t("onboarding.selectPIN.restore.title")}</Title>
//             <Box alignItems="center" mt={7}>
//               <SelectPin modelId={model.id} restore />
//             </Box>
//           </Box>
//         ) : (
//           <Box grow alignItems="center">
//             <Title>{t("onboarding.selectPIN.initialize.title")}</Title>
//             <Box alignItems="center" mt={7}>
//               <SelectPin modelId={model.id} />
//             </Box>
//           </Box>
//         )}
//       </GrowScroll>
//       <OnboardingFooter horizontal flow={2} t={t} nextStep={nextStep} prevStep={prevStep} />
//     </FixedTopContainer>
//   );
// };
