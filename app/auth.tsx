import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import styled from "styled-components/native";
import { router } from "expo-router";

import { supabase } from "../src/lib/supabase";

type AuthMode = "login" | "signup";

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const onSubmit = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password.trim()) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          Alert.alert("Login failed", error.message);
          return;
        }

        router.replace("/(tabs)");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
        });

        if (error) {
          Alert.alert("Sign up failed", error.message);
          return;
        }

        if (data.session) {
          router.replace("/(tabs)");
          return;
        }

        Alert.alert(
          "Account created",
          "Your account was created successfully. You can now log in."
        );

        setMode("login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <Content>
            <Title>{isLogin ? "Welcome back" : "Create account"}</Title>
            <Subtitle>
              {isLogin
                ? "Log in to sync your reading life."
                : "Create your account to save books, notes, and lists."}
            </Subtitle>

            <ToggleWrap>
              <ToggleButton
                active={isLogin}
                onPress={() => setMode("login")}
              >
                <ToggleButtonText active={isLogin}>Login</ToggleButtonText>
              </ToggleButton>

              <ToggleButton
                active={!isLogin}
                onPress={() => setMode("signup")}
              >
                <ToggleButtonText active={!isLogin}>Sign up</ToggleButtonText>
              </ToggleButton>
            </ToggleWrap>

            <FormCard>
              <FieldLabel>Email</FieldLabel>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="rgba(113, 113, 130, 0.9)"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />

              <FieldLabel>Password</FieldLabel>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                placeholderTextColor="rgba(113, 113, 130, 0.9)"
                secureTextEntry
              />

              <PrimaryButton onPress={onSubmit} disabled={loading}>
                <PrimaryButtonText>
                  {loading
                    ? "Please wait..."
                    : isLogin
                      ? "Log in"
                      : "Create account"}
                </PrimaryButtonText>
              </PrimaryButton>
            </FormCard>
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
`;

const Content = styled.View`
  width: 100%;
  max-width: 460px;
  align-self: center;
  padding: 24px 18px 40px 18px;
`;

const Title = styled.Text`
  font-size: 32px;
  line-height: 38px;
  color: ${({ theme }) => theme.colors.foreground};
  font-weight: ${({ theme }) => theme.font.family.bold};
  letter-spacing: -0.4px;
`;

const Subtitle = styled.Text`
  margin-top: 8px;
  font-size: 15px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.mutedForeground};
  font-weight: ${({ theme }) => theme.font.family.medium};
`;

const ToggleWrap = styled.View`
  margin-top: 24px;
  flex-direction: row;
  background: ${({ theme }) => theme.colors.muted};
  border-radius: 999px;
  padding: 4px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const ToggleButton = styled.Pressable<{ active: boolean }>`
  flex: 1;
  height: 40px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : "transparent"};
`;

const ToggleButtonText = styled.Text<{ active: boolean }>`
  color: ${({ active, theme }) =>
    active ? theme.colors.primaryForeground : theme.colors.foreground};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const FormCard = styled.View`
  margin-top: 18px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.xl}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 18px;
`;

const FieldLabel = styled.Text`
  margin-top: 10px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;

const Input = styled.TextInput`
  height: 48px;
  border-radius: 14px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  padding: 0 14px;
  color: ${({ theme }) => theme.colors.foreground};
  font-size: 15px;
  font-family: ${({ theme }) => theme.font.family.medium};
`;

const PrimaryButton = styled.Pressable`
  margin-top: 20px;
  height: 48px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.primary};
`;

const PrimaryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryForeground};
  font-size: 15px;
  font-weight: ${({ theme }) => theme.font.family.semibold};
`;