"use client";


import { Bell, Moon, Sun, TrendingUp } from "lucide-react";
import { NotificationCenter } from "./notification-center";
import { useTheme } from "@/lib/theme-context";
import { useNotifications } from "@/hooks/use-notifications";
import React from "react";

export function TopAppBar({ disableNotifications = false }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const { unreadCount } = useNotifications();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header className="sticky top-0 z-50 bg-on-secondary-fixed text-white px-6 py-4 flex items-center justify-between shadow-sm">
        
        {/* Tema continua normal */}
        <div className="flex items-center">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Alternar tema"
          >
            {theme === 'light' ? (
              <Moon className="w-6 h-6" />
            ) : (
              <Sun className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <div className="bg-primary-container p-1.5 rounded-xl flex items-center justify-center shadow-sm">
            <TrendingUp className="w-5 h-5 text-on-primary" />
          </div>
          <h1 className="font-headline font-bold tracking-tight text-2xl">FinexyIA</h1>
        </div>

        {/* Notificação controlada */}
        <button 
          onClick={() => {
            if (!disableNotifications) {
              setIsNotificationsOpen(true);
            }
          }}
          disabled={disableNotifications}
          className={`p-2 relative rounded-full transition-colors ${
            disableNotifications
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-white/10"
          }`}
        >
          <Bell className="w-6 h-6" />

          {!disableNotifications && unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-on-secondary-fixed"></span>
          )}
        </button>
      </header>
      
      {!disableNotifications && (
        <NotificationCenter 
          isOpen={isNotificationsOpen} 
          onClose={() => setIsNotificationsOpen(false)} 
        />
      )}
    </>
  );
}