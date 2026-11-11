import { useState, useMemo, useRef, useEffect } from 'react';
import { SEQUENCE_TOPICS } from './sequenceData';
import type { MajorTopic, SubtopicData, SequenceTopicId } from './types';
import SequenceTopicWorkspace from './SequenceTopicWorkspace';
import {
  Search,
  ChevronDown,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface SequencesHubProps {
  defaultTopicId?: string;
  defaultSubtopicId?: string;
  onTopicChange?: (id: string) => void;
}

export default function SequencesHub({
  defaultTopicId,
  defaultSubtopicId,
  onTopicChange
}: SequencesHubProps) {
  // Navigation State
  const [activeTopicId, setActiveTopicId] = useState<SequenceTopicId>(
    (defaultTopicId as SequenceTopicId) || 'basics'
  );
  const [activeSubtopicId, setActiveSubtopicId] = useState<string>(
    defaultSubtopicId || 'what_is_sequence'
  );

  // Desktop Hover Navigation Popover
  const [hoveredTopicId, setHoveredTopicId] = useState<string | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile Accordion Open States
  const [mobileExpandedTopic, setMobileExpandedTopic] = useState<string | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Sync external props
  useEffect(() => {
    if (defaultTopicId && SEQUENCE_TOPICS.some(t => t.id === defaultTopicId)) {
      setActiveTopicId(defaultTopicId as SequenceTopicId);
      const major = SEQUENCE_TOPICS.find(t => t.id === defaultTopicId);
      if (major && major.subtopics.length > 0) {
        if (defaultSubtopicId && major.subtopics.some(s => s.id === defaultSubtopicId)) {
          setActiveSubtopicId(defaultSubtopicId);
        } else {
          setActiveSubtopicId(major.subtopics[0].id);
        }
      }
    }
  }, [defaultTopicId, defaultSubtopicId]);

  // Resolvers
  const activeMajorTopic = useMemo<MajorTopic>(() => {
    return SEQUENCE_TOPICS.find(t => t.id === activeTopicId) || SEQUENCE_TOPICS[0];
  }, [activeTopicId]);

  const activeSubtopic = useMemo<SubtopicData>(() => {
    const found = activeMajorTopic.subtopics.find(s => s.id === activeSubtopicId);
    return found || activeMajorTopic.subtopics[0];
  }, [activeMajorTopic, activeSubtopicId]);

  // Desktop Hover Handlers
  const handleMouseEnter = (topicId: string) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setHoveredTopicId(topicId);
  };

  const handleMouseLeave = () => {
    hoverTimerRef.current = setTimeout(() => {
      setHoveredTopicId(null);
    }, 180);
  };

  const handleSelectSubtopic = (topicId: SequenceTopicId, subId: string) => {
    setActiveTopicId(topicId);
    setActiveSubtopicId(subId);
    setHoveredTopicId(null);
    setIsSearchOpen(false);
    setSearchQuery('');
    setMobileExpandedTopic(null);
    onTopicChange?.(topicId);
  };

  // Search indexing
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: { topic: MajorTopic; sub: SubtopicData }[] = [];

    SEQUENCE_TOPICS.forEach(topic => {
      topic.subtopics.forEach(sub => {
        if (
          sub.title.toLowerCase().includes(q) ||
          sub.shortDesc.toLowerCase().includes(q) ||
          sub.definition.toLowerCase().includes(q) ||
          topic.title.toLowerCase().includes(q)
        ) {
          results.push({ topic, sub });
        }
      });
    });

    return results.slice(0, 8);
  }, [searchQuery]);

  return (
    <div className="space-y-6 font-sans">
      {/* ─── CLASSIC PROGRESSION ROADMAP BANNER ─── */}
      <div className="bg-[#081226] border border-[#14264c] rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#132244]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-serif font-bold text-lg">
              ∑
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold font-mono">
                CLASSICAL MATHEMATICAL CURRICULUM
              </div>
              <h2 className="text-base sm:text-lg font-serif text-white font-medium">
                Sequence & Series Academic Master Workspace
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs font-mono text-slate-300">
            <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
              15 Main Topics
            </span>
            <span>·</span>
            <span className="px-2 py-0.5 rounded bg-[#0c1833] border border-[#162c57] text-slate-300">
              Scratch → University Level
            </span>
          </div>
        </div>

        {/* 3-Stage Visual Roadmap Pathway */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-3 pt-1">
          <div className="p-2.5 rounded-xl bg-[#060c1d] border border-[#132244] flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-300 font-mono text-xs font-bold shrink-0">
              1
            </span>
            <div>
              <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                Beginner & Foundation
              </div>
              <div className="text-[11px] text-slate-300 font-serif">
                Basics · A.P. · G.P. · H.P. · Means · Special
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#060c1d] border border-[#132244] flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center text-indigo-300 font-mono text-xs font-bold shrink-0">
              2
            </span>
            <div>
              <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                Intermediate Series
              </div>
              <div className="text-[11px] text-slate-300 font-serif">
                Finite/Infinite · Decimals · Sigma · Telescoping
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#060c1d] border border-[#132244] flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-amber-600/20 border border-amber-500/50 flex items-center justify-center text-amber-300 font-mono text-xs font-bold shrink-0">
              3
            </span>
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Advanced & University
              </div>
              <div className="text-[11px] text-slate-300 font-serif">
                Convergence · Tests · Power · Taylor · Binomial
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── QUICK SEARCH BAR ─── */}
      <div className="relative bg-[#081226] border border-[#14264c] rounded-xl p-3 flex items-center gap-3">
        <Search className="w-4 h-4 text-blue-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
          placeholder="Search any Sequence & Series topic (e.g. Arithmetic Mean, Ratio Test, Telescoping, Maclaurin, Binomial)..."
          className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setIsSearchOpen(false);
            }}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 font-mono"
          >
            Clear
          </button>
        )}

        {/* Search Results Dropdown Overlay */}
        {isSearchOpen && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-[#0b162f] border border-[#162c57] rounded-xl shadow-2xl p-3 z-50 max-h-80 overflow-y-auto space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 px-2 py-1 font-semibold">
              Matching Topics ({searchResults.length}):
            </div>
            {searchResults.map(({ topic, sub }) => (
              <button
                key={sub.id}
                onClick={() => handleSelectSubtopic(topic.id, sub.id)}
                className="w-full text-left p-2.5 rounded-lg hover:bg-[#12244a] flex items-center justify-between group transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-blue-300 flex items-center gap-2">
                    <span>{sub.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
                      {topic.shortTitle}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{sub.shortDesc}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── DESKTOP HOVER & SUBTOPIC NAVIGATION BAR ─── */}
      <div className="relative">
        {/* Horizontal Navigation Strip */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin border-b border-[#14264c]">
          {SEQUENCE_TOPICS.map((topic) => {
            const isActive = activeTopicId === topic.id;
            const isHovered = hoveredTopicId === topic.id;

            return (
              <div
                key={topic.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(topic.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => {
                    setActiveTopicId(topic.id);
                    setActiveSubtopicId(topic.subtopics[0].id);
                    onTopicChange?.(topic.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : isHovered
                      ? 'bg-[#0e2148] text-white border border-blue-500/50'
                      : 'bg-[#081226] text-slate-300 hover:text-white hover:bg-[#0c1c3c] border border-[#14264c]'
                  }`}
                >
                  <span className="text-[10px] text-blue-300 font-mono font-bold">
                    {topic.number}
                  </span>
                  <span>{topic.shortTitle}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${
                      isHovered ? 'rotate-180 text-blue-300' : 'text-slate-400'
                    }`}
                  />
                </button>

                {/* Subtopic Popover Dropdown on Hover */}
                {isHovered && (
                  <div className="absolute left-0 top-full mt-1.5 w-72 bg-[#0b162f] border border-[#162c57] rounded-xl shadow-2xl p-2.5 z-40 space-y-1 animate-fade-in">
                    <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-blue-400 font-semibold border-b border-[#14264c] mb-1">
                      {topic.title} Subtopics:
                    </div>

                    {topic.subtopics.map((sub) => {
                      const isSubActive =
                        activeTopicId === topic.id && activeSubtopicId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSelectSubtopic(topic.id, sub.id)}
                          className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between group ${
                            isSubActive
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : 'text-slate-300 hover:bg-[#12244a] hover:text-white'
                          }`}
                        >
                          <div>
                            <div className="font-medium">{sub.title}</div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">
                              {sub.shortDesc}
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── MOBILE & TABLET ACCORDION NAVIGATION ─── */}
        <div className="lg:hidden space-y-1.5">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold px-1">
            Tap a Topic to Explore Subtopics:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SEQUENCE_TOPICS.map((topic) => {
              const isTopicActive = activeTopicId === topic.id;
              const isExpanded = mobileExpandedTopic === topic.id;

              return (
                <div
                  key={topic.id}
                  className="rounded-xl border border-[#14264c] bg-[#081226] overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setMobileExpandedTopic(isExpanded ? null : topic.id)
                    }
                    className={`w-full flex items-center justify-between p-3 text-xs font-medium text-left transition-colors ${
                      isTopicActive
                        ? 'bg-blue-950/60 text-blue-300'
                        : 'text-slate-200 hover:bg-[#0c1833]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-blue-400">
                        {topic.number}
                      </span>
                      <span>{topic.title}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isExpanded ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="p-2 bg-[#060c1d] border-t border-[#14264c] space-y-1">
                      {topic.subtopics.map((sub) => {
                        const isSubActive =
                          activeTopicId === topic.id && activeSubtopicId === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSelectSubtopic(topic.id, sub.id)}
                            className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                              isSubActive
                                ? 'bg-blue-900/60 text-white font-semibold'
                                : 'text-slate-300 hover:bg-[#0c1833]'
                            }`}
                          >
                            <span>{sub.title}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── ACTIVE TOPIC'S DEDICATED INDIVIDUAL WORKSPACE ─── */}
      <SequenceTopicWorkspace
        key={`${activeMajorTopic.id}-${activeSubtopic.id}`}
        majorTopic={activeMajorTopic}
        subtopic={activeSubtopic}
      />
    </div>
  );
}

