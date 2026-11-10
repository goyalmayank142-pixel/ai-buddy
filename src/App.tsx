import React, { useState } from 'react';
import { PhoneFrame } from './components/mobile/PhoneFrame';
import { MobileBottomNav, BuddyTab } from './components/mobile/MobileBottomNav';
import { BuddyHome } from './components/buddy/BuddyHome';
import { BuddyLiveVision } from './components/buddy/BuddyLiveVision';
import { BuddyChatView } from './components/buddy/BuddyChatView';
import { BuddyGuidesView } from './components/buddy/BuddyGuidesView';
import { BuddyGuideModal } from './components/buddy/BuddyGuideModal';
import { ApiKeySettingsModal } from './components/common/ApiKeySettingsModal';
import { BuddyFixGuide } from './data/buddyGuides';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<BuddyTab>('home');
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>();
  const [activeGuide, setActiveGuide] = useState<BuddyFixGuide | null>(null);
  const [showAiSettings, setShowAiSettings] = useState(false);

  const handleStartChatWithPrompt = (prompt?: string) => {
    setChatInitialPrompt(prompt);
    setCurrentTab('chat');
  };

  return (
    <PhoneFrame>
      {/* Main Dynamic Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {currentTab === 'home' && (
          <BuddyHome
            onOpenCamera={() => setCurrentTab('camera')}
            onStartChat={handleStartChatWithPrompt}
            onOpenGuide={(guide) => setActiveGuide(guide)}
            onOpenSettings={() => setShowAiSettings(true)}
          />
        )}

        {currentTab === 'camera' && (
          <BuddyLiveVision
            onClose={() => setCurrentTab('home')}
            onOpenChatWithTopic={(topic) => handleStartChatWithPrompt(topic)}
          />
        )}

        {currentTab === 'chat' && (
          <BuddyChatView
            initialPrompt={chatInitialPrompt}
            onBack={() => setCurrentTab('home')}
            onOpenCamera={() => setCurrentTab('camera')}
          />
        )}

        {currentTab === 'guides' && (
          <BuddyGuidesView
            onSelectGuide={(guide) => setActiveGuide(guide)}
            onOpenCamera={() => setCurrentTab('camera')}
          />
        )}
      </div>

      {/* Persistent Bottom Tab Bar (hidden when camera is in full viewfinder mode) */}
      {currentTab !== 'camera' && (
        <MobileBottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
        />
      )}

      {/* Guide Detail Modal with Video & Steps */}
      {activeGuide && (
        <BuddyGuideModal
          guide={activeGuide}
          onClose={() => setActiveGuide(null)}
          onOpenCamera={() => {
            setActiveGuide(null);
            setCurrentTab('camera');
          }}
          onAskBuddy={(question) => {
            setActiveGuide(null);
            handleStartChatWithPrompt(question);
          }}
        />
      )}

      {/* Settings Modal */}
      {showAiSettings && (
        <ApiKeySettingsModal onClose={() => setShowAiSettings(false)} />
      )}
    </PhoneFrame>
  );
};

export default App;
