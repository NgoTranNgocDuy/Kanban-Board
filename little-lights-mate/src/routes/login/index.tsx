import { AuthPage, ThemedTitleV2 } from "@refinedev/antd";

import { authCredentials } from "@/providers";

export const LoginPage = () => {
  return (
    <AuthPage
      type="login"
      registerLink={true}
      forgotPasswordLink={true}
      title={<ThemedTitleV2 collapsed={true} text="Refine Project 1" />}
      formProps={{
        initialValues: authCredentials,
      }}
    />
  );
};