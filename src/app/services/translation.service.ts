import { Injectable } from '@angular/core';

const I18N: any = {
  en: {
    // Shared Navigation & General
    dashboard: 'Dashboard', vote: 'Vote', results: 'Results', analytics: 'Analytics', logout: 'Logout', adminPortal: 'Admin Portal',
    search: 'Search by candidate name or party...',
    seat_president: 'President', seat_governor: 'Governor', seat_senator: 'Senator', seat_mp: 'Member of Parliament', seat_woman_rep: 'Woman Representative', seat_mca: 'Member of County Assembly',
    totalVotes: 'Total Votes:', leading: 'LEADING', votes: 'votes',

    // Voting
    ballotJourney: 'Your Ballot Journey', completed: 'Completed', allDone: 'ALL BALLOTS COMPLETED!',
    castVote: 'Cast Your Vote', selectSeat: 'Select a seat to vote for', voteNow: 'Vote Now',
    backToSeats: 'Back to Seats', selectCandidate: 'Select your candidate',
    proceedConfirm: 'Proceed to Confirm Vote', noCandidates: 'No candidates found for this seat in your region.',
    votedSuccess: 'Voted Successfully',
    confirmVote: 'Confirm Vote', cancelVote: 'Cancel', voteWarning: 'This action cannot be undone.',

    // Dashboard
    activeElections: 'Active Elections', currentVotingSession: 'Current Voting Session', endsIn: 'Ends in',
    status: 'Status', live: 'LIVE', verification: 'Verification', biometric: 'Biometric Verified',
    device: 'Device', secureSession: 'Secure Session', quickActions: 'Quick Actions',
    yourBallot: 'Your Ballot', readyToCast: 'Ready to cast your vote', startVoting: 'Start Voting',
    liveResults: 'Live Results', viewTrends: 'View current election trends', viewResults: 'View Results',
    regionalStats: 'Regional Stats', exploreData: 'Explore voting data', viewAnalytics: 'View Analytics',
    votingProgress: 'Your Voting Progress', ballotsCast: 'ballots cast', verified: 'Verified',
    unverified: 'Unverified', securityStatus: 'Security Status', network: 'Network', encrypted: 'Encrypted',
    server: 'Server', connected: 'Connected', node: 'Node', active: 'Active',
    copyright: '© 2026 Independent Electoral and Boundaries Commission',
    welcomeBack: 'Welcome Back', voterCode: 'Voter Code', county: 'County', constituency: 'Constituency', ward: 'Ward',
    seatsVoted: 'Seats Voted', progress: 'Progress', pending: 'Pending', yourVotingStatus: 'Your Voting Status', level: 'Level',

    // Results
    liveRefreshes: 'Live · refreshes every 2s', noResults: 'No results available yet.',
    loginToView: 'Please login to view your results.', failedToLoad: 'Failed to load results. Please try again.',
    trendingParties: 'Trending Parties',

    // Analytics
    analyticsTitle: 'Advanced Regional Analytics', analyticsDesc: 'Filter votes cast by Province, County, or Constituency',
    filterResults: 'Filter Results', province: 'Province',
    allProvinces: '-- All Provinces --', allCounties: '-- All Counties in Province --', allConstituencies: '-- All Constituencies in County --',
    chartDistribution: 'Vote Distribution', backToDashboard: 'Back to Dashboard', presidentialRaceOverview: 'Presidential Race Overview',
    votesFromConstituency: 'Votes from Constituency', votesFromCounty: 'Votes from County', votesFromProvince: 'Votes from Province',
    nationalVotes: 'National Votes', seatName: 'Seat Name', candidate: 'Candidate', party: 'Party', votesCast: 'Votes Cast',
    view: 'View', barChart: 'Bar Chart', noVotesRecorded: 'No votes recorded for the selected region.',
    
    // Admin
    registeredVoters: 'REGISTERED VOTERS', candidates: 'CANDIDATES', electionLeaders: 'ELECTION LEADERS', liveAuditLog: 'LIVE AUDIT LOG',
    electionCommandCenter: 'ELECTION COMMAND CENTER', liveSystemObservatory: 'LIVE SYSTEM OBSERVATORY',
    electionStatus: 'ELECTION STATUS', activeUpper: 'ACTIVE', systemAccepting: 'System is currently accepting public votes.',
    totalRegisteredUpper: 'TOTAL REGISTERED', votesCastUpper: 'VOTES CAST', turnoutUpper: 'TURNOUT',
    dbVelocity: 'DB VELOCITY', goToDashboardUpper: 'GO TO DASHBOARD', haltElection: 'HALT ELECTION', wipeDatabase: 'WIPE DATABASE & RESTART',
    voterCodeUpper: 'VOTER CODE', fullNameUpper: 'FULL NAME', countyUpper: 'COUNTY', constituencyUpper: 'CONSTITUENCY', registeredAtUpper: 'REGISTERED AT',
    positionUpper: 'POSITION', votesUpper: 'VOTES', actionUpper: 'ACTION', timestampUpper: 'TIMESTAMP', detailsUpper: 'DETAILS'
  },
  sw: {
    // Shared Navigation & General
    dashboard: 'Dashibodi', vote: 'Kura', results: 'Matokeo', analytics: 'Uchambuzi', logout: 'Toka', adminPortal: 'Lango la Msimamizi',
    search: 'Tafuta kwa jina au chama...',
    seat_president: 'Rais', seat_governor: 'Gavana', seat_senator: 'Seneta', seat_mp: 'Mbunge', seat_woman_rep: 'Mwakilishi wa Wanawake', seat_mca: 'Mwakilishi wa Wadi',
    totalVotes: 'Jumla ya Kura:', leading: 'KIONGOZI', votes: 'kura',

    // Voting
    ballotJourney: 'Hatua Zako Za Kura', completed: 'Zimekamilika', allDone: 'UMEPIGA KURA ZOTE!',
    castVote: 'Piga Kura Yako', selectSeat: 'Chagua kiti cha kupigia kura', voteNow: 'Piga Kura Sasa',
    backToSeats: 'Rudi Nyuma', selectCandidate: 'Chagua mgombea wako',
    proceedConfirm: 'Endelea Kuthibitisha', noCandidates: 'Hakuna wagombea waliopatikana kwa kiti hiki katika eneo lako.',
    votedSuccess: 'Imepigwa Kura Kikamilifu',
    confirmVote: 'Thibitisha Kura', cancelVote: 'Ghairi', voteWarning: 'Hatua hii haiwezi kubatilishwa.',

    // Dashboard
    activeElections: 'Uchaguzi Unaoendelea', currentVotingSession: 'Kipindi cha Upigaji Kura', endsIn: 'Inaisha baada ya',
    status: 'Hali', live: 'MOJA KWA MOJA', verification: 'Uthibitisho', biometric: 'Imethibitishwa (Biometric)',
    device: 'Kifaa', secureSession: 'Kipindi Salama', quickActions: 'Vitendo vya Haraka',
    yourBallot: 'Kura Yako', readyToCast: 'Tayari kupiga kura yako', startVoting: 'Anza Kupiga Kura',
    liveResults: 'Matokeo Moja kwa Moja', viewTrends: 'Tazama mwenendo wa uchaguzi', viewResults: 'Tazama Matokeo',
    regionalStats: 'Takwimu za Mikoa', exploreData: 'Chunguza data za kura', viewAnalytics: 'Tazama Uchambuzi',
    votingProgress: 'Maendeleo Yako ya Kura', ballotsCast: 'kura zilizopigwa', verified: 'Imethibitishwa',
    unverified: 'Haijathibitishwa', securityStatus: 'Hali ya Usalama', network: 'Mtandao', encrypted: 'Imesimbwa (Encrypted)',
    server: 'Seva', connected: 'Imeunganishwa', node: 'Nodi', active: 'Inafanya kazi',
    copyright: '© 2026 Tume Huru ya Uchaguzi na Mipaka',
    welcomeBack: 'Karibu Tena', voterCode: 'Nambari ya Kura', county: 'Kaunti', constituency: 'Eneo Bunge', ward: 'Wadi',
    seatsVoted: 'Viti Viliyopigiwa Kura', progress: 'Maendeleo', pending: 'Inasubiri', yourVotingStatus: 'Hali Yako ya Kupiga Kura', level: 'Ngazi',

    // Results
    liveRefreshes: 'Moja kwa moja · inasasishwa kila 2s', noResults: 'Hakuna matokeo yaliyopatikana bado.',
    loginToView: 'Tafadhali ingia ili uone matokeo yako.', failedToLoad: 'Imeshindwa kupakia matokeo. Jaribu tena.',
    trendingParties: 'Vyama Vinavyovuma',

    // Analytics
    analyticsTitle: 'Uchambuzi wa Kina wa Mikoa', analyticsDesc: 'Chuja kura zilizopigwa kwa Mkoa, Kaunti, au Eneo Bunge',
    filterResults: 'Chuja Matokeo', province: 'Mkoa',
    allProvinces: '-- Mikoa Yote --', allCounties: '-- Kaunti Zote Kwenye Mkoa --', allConstituencies: '-- Maeneo Bunge Yote Kwenye Kaunti --',
    chartDistribution: 'Mchanganuo wa Kura', backToDashboard: 'Rudi Dashibodi', presidentialRaceOverview: 'Taswira ya Mbio za Urais',
    votesFromConstituency: 'Kura Kutoka Eneo Bunge', votesFromCounty: 'Kura Kutoka Kaunti', votesFromProvince: 'Kura Kutoka Mkoa',
    nationalVotes: 'Kura za Kitaifa', seatName: 'Jina la Kiti', candidate: 'Mgombea', party: 'Chama', votesCast: 'Kura Zilizopigwa',
    view: 'Tazama', barChart: 'Mchoro wa Baa', noVotesRecorded: 'Hakuna kura zilizorekodiwa katika eneo lililochaguliwa.',

    // Admin
    registeredVoters: 'WAPIGA KURA WALIOANDIKISHWA', candidates: 'WAGOMBEA', electionLeaders: 'VIONGOZI WA UCHAGUZI', liveAuditLog: 'KUMBUKUMBU YA MOJA KWA MOJA',
    electionCommandCenter: 'KITUO CHA AMRI CHA UCHAGUZI', liveSystemObservatory: 'UANGALIZI WA MFUMO MOJA KWA MOJA',
    electionStatus: 'HALI YA UCHAGUZI', activeUpper: 'INAFANYA KAZI', systemAccepting: 'Mfumo unapokea kura za umma hivi sasa.',
    totalRegisteredUpper: 'JUMLA WALIOANDIKISHWA', votesCastUpper: 'KURA ZILIZOPIGWA', turnoutUpper: 'WALIOJITOKEZA',
    dbVelocity: 'KASI YA DB', goToDashboardUpper: 'RUDI DASHIBODI', haltElection: 'SIMAMISHA UCHAGUZI', wipeDatabase: 'FUTA HIFADHI NA UANZE UPYA',
    voterCodeUpper: 'NAMBARI YA KURA', fullNameUpper: 'JINA KAMILI', countyUpper: 'KAUNTI', constituencyUpper: 'ENEO BUNGE', registeredAtUpper: 'ILIYOSAJILIWA',
    positionUpper: 'CHEO', votesUpper: 'KURA', actionUpper: 'KITENDO', timestampUpper: 'MUDA', detailsUpper: 'MAELEZO'
  }
};

@Injectable({
  providedIn: "root"
})
export class TranslationService {
  /**
   * Localization Engine: 
   * Manages English (EN) and Swahili (SW) language states.
   * Persists user choice in localStorage and triggers global UI updates via CustomEvents.
   */
  currentLang: "en" | "sw" = "en";
  /** Increments every time the language changes — bind this in templates to force re-render */
  langTick = 0;

  constructor() {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "sw") {
      this.currentLang = saved;
    }
  }

  t(key: string): string {
    return I18N[this.currentLang][key] || key;
  }

  toggleLang() {
    this.currentLang = this.currentLang === "en" ? "sw" : "en";
    this.langTick++;
    localStorage.setItem("lang", this.currentLang);
    window.dispatchEvent(new CustomEvent('langChanged', { detail: { lang: this.currentLang } }));
  }
}
