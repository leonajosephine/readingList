import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { router } from "expo-router";
import { Session } from "@supabase/supabase-js";

import { supabase } from "../src/lib/supabase";

export default function IndexScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      redirectFromSession(session);
      setLoading(false);
    };

    const redirectFromSession = (session: Session | null) => {
      if (session) {
        router.replace("/(tabs)");
      } else {
        router.replace("/auth");
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      redirectFromSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Screen>
      <ActivityIndicator size="large" />
    </Screen>
  );
}

const Screen = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
`;