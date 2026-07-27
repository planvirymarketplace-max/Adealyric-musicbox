/**
 * Barrel export — re-export all hooks from each domain for convenient import.
 * Usage: import { useSongs, useLogin, useBookings } from '@/hooks/queries';
 */

// Auth
export {
  useLogin,
  useRegister,
  useSession,
  useLogout,
  useAuth,
} from './auth';

// Catalog
export {
  useSongs,
  useSong,
  useCreateSong,
  useUpdateSong,
  useDeleteSong,
  useReleases,
  useRelease,
  useCreateRelease,
  useUpdateRelease,
  useValidateRelease,
} from './catalog';

// Rights
export {
  useRightsRecords,
  useRightsRecord,
  useCreateRightsRecord,
  useUpdateRightsRecord,
  useSplits,
  useCreateSplit,
  useUpdateSplit,
  useClearanceStatus,
  useTerritoryMatrix,
} from './rights';

// Distribution
export {
  useDspAdapters,
  useCreateDspAdapter,
  useDeliveries,
  useDelivery,
  useQueueDelivery,
  useRetryDelivery,
  useDdexXml,
} from './distribution';

// Sync
export {
  useSyncSearch,
  useSyncRequests,
  useSyncRequest,
  useCreateSyncRequest,
  useProcessClearance,
  useSyncContract,
  useExclusivityCheck,
} from './sync';

// Marketplace
export {
  useListings,
  useListing,
  useSubmitForSale,
  useOffers,
  useMakeOffer,
  useProcessNegotiation,
  useCompletePurchase,
  useCustomWrites,
  useCreateCustomWrite,
  useCollabCalls,
  useCreateCollabCall,
  useApplyToCollabCall,
} from './marketplace';

// Royalties
export {
  useRoyaltyStatements,
  useRoyaltyStatement,
  useSplitPayments,
  usePerStreamRate,
  useMechanicalRoyalty,
  useRecoupment,
} from './royalties';

// Validation
export {
  useValidationChecks,
  useRunValidation,
} from './validation';

// Shop
export {
  useShopProducts,
  useShopProduct,
  useCreateProduct,
  useUpdateProduct,
  useOrders,
  useOrder,
  useCreateOrder,
} from './shop';

// Events
export {
  useEvents,
  useEvent,
  useCreateEvent,
  useTicketTiers,
  usePurchaseTickets,
} from './events';

// Bookings
export {
  useBookingInquiries,
  useBookingInquiry,
  useCreateInquiry,
  useBookings,
  useCreateBooking,
} from './bookings';

// Fans
export {
  useFans,
  useFan,
  useLoyaltyActions,
  useRecordLoyaltyAction,
} from './fans';

// Messages
export {
  useMessageThreads,
  useThreadMessages,
  useCreateThread,
  useSendMessage,
} from './messages';

// CMS
export {
  useCmsPages,
  useCmsPage,
  useCreatePage,
  useUpdatePage,
} from './cms';
