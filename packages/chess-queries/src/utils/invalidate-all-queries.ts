// Common function to invalidate all queries at once
import { useQueryClient } from "@tanstack/react-query";

export function useInvalidateAllQueries() {
  const queryClient = useQueryClient();

  return async () => {
    // Invalidate all queries across the entire application
    await queryClient.invalidateQueries();
  };
}

// Alternative: More specific invalidation for crypto-related queries
export function useInvalidateCryptoQueries() {
  const queryClient = useQueryClient();

  return async () => {
    // Invalidate all crypto-related queries
    await Promise.all([
      // Match queries
      queryClient.invalidateQueries({ queryKey: ["match"] }),
      queryClient.invalidateQueries({ queryKey: ["matches"] }),

      // Profile queries  
      queryClient.invalidateQueries({ queryKey: ["profile"] }),
      queryClient.invalidateQueries({ queryKey: ["profiles"] }),

      // Registry queries
      queryClient.invalidateQueries({ queryKey: ["registry"] }),

      // Account/balance queries
      queryClient.invalidateQueries({ queryKey: ["balance"] }),
      queryClient.invalidateQueries({ queryKey: ["signatures"] }),
      queryClient.invalidateQueries({ queryKey: ["tokenAccounts"] }),
    ]);
  };
}
