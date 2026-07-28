/**
 * DDEX ERN XML Builder — Generates valid DDEX ERN 4.2 XML from metadata structures.
 *
 * DDEX (Digital Data Exchange) is the global standard for music industry data exchange.
 * ERN (Electronic Release Notification) is the specific message type used to deliver
 * release metadata, resource references, and commercial deal terms to DSPs.
 *
 * Key DDEX concepts:
 * - MessageHeader: Identifies sender, recipient, and message threading for async delivery
 * - ResourceList: Contains SoundRecording resources (the actual audio tracks)
 * - ReleaseList: Contains Release elements (the album/EP/single container)
 * - DealList: Contains commercial deal terms (SubscriptionModel, PayForUse, etc.)
 * - Each resource gets a ResourceReference (A001, A002...) linked to the Release
 * - Territories use ISO 3166-1 alpha-2 codes (US, GB, DE, WW for Worldwide)
 *
 * The builder escapes all text content for XML safety and produces a structure
 * that conforms to the DDEX ERN 4.2 schema (ernm/ern namespaces).
 */

import type { DdexErnMessage, DdexSoundRecording, DdexRelease, DdexDeal } from '@/lib/metadata-engine';

// ============ XML ESCAPING & UTILITIES ============

/** Escape text content for safe XML embedding */
function xmlEscape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Wrap a tag with optional attributes and content */
function xmlTag(tag: string, content: string | null, attributes?: Record<string, string>): string {
  const attrStr = attributes
    ? ' ' + Object.entries(attributes).map(([k, v]) => `${k}="${xmlEscape(v)}"`).join(' ')
    : '';
  if (content === null || content === undefined) return `<${tag}${attrStr}/>`;
  return `<${tag}${attrStr}>${content}</${tag}>`;
}

/** Wrap a tag with child elements (no text content) */
function xmlBlock(tag: string, children: string, attributes?: Record<string, string>): string {
  const attrStr = attributes
    ? ' ' + Object.entries(attributes).map(([k, v]) => `${k}="${xmlEscape(v)}"`).join(' ')
    : '';
  return `<${tag}${attrStr}>${children}</${tag}>`;
}

// ============ SUB-BUILDERS ============

/** Build the MessageHeader element */
function buildMessageHeader(header: DdexErnMessage['messageHeader']): string {
  return xmlBlock('MessageHeader', [
    xmlTag('MessageThreadId', xmlEscape(header.messageThreadId)),
    xmlTag('MessageId', xmlEscape(header.messageId)),
    xmlBlock('MessageSender', [
      xmlTag('PartyId', xmlEscape(header.messageSender.partyId)),
      xmlTag('PartyName', [
        xmlBlock('FullName', xmlEscape(header.messageSender.partyName)),
      ].join('')),
    ].join('')),
    xmlBlock('MessageRecipient', [
      xmlTag('PartyId', xmlEscape(header.messageRecipient.partyId)),
      xmlTag('PartyName', [
        xmlBlock('FullName', xmlEscape(header.messageRecipient.partyName)),
      ].join('')),
    ].join('')),
    xmlTag('MessageCreatedDateTime', xmlEscape(header.messageCreatedDateTime)),
  ].join(''));
}

/** Build a single SoundRecording resource element */
function buildSoundRecording(sr: DdexSoundRecording): string {
  const techChildren = [
    xmlTag('AudioCodecType', xmlEscape(sr.technicalDetails.audioCodecType)),
    xmlTag('BitRate', String(sr.technicalDetails.bitRate)),
    xmlTag('SamplingRate', String(sr.technicalDetails.samplingRate)),
    xmlTag('BitsPerSample', String(sr.technicalDetails.bitsPerSample)),
    xmlTag('NumberOfChannels', String(sr.technicalDetails.numberOfChannels)),
  ].join('');

  const artistChildren = sr.displayArtist.map((a) =>
    xmlBlock('DisplayArtist', [
      xmlBlock('PartyName', [
        xmlBlock('FullName', xmlEscape(a.partyName)),
      ].join('')),
      xmlTag('ArtistRole', xmlEscape(a.role)),
    ].join(''))
  ).join('');

  const genreChildren = [
    xmlTag('GenreText', xmlEscape(sr.genre.genreText)),
    ...(sr.genre.subGenre ? [xmlTag('SubGenre', xmlEscape(sr.genre.subGenre))] : []),
  ].join('');

  return xmlBlock('SoundRecording', [
    xmlTag('ResourceId', xmlEscape(sr.resourceId)),
    xmlTag('ResourceReference', xmlEscape(sr.resourceReference)),
    xmlTag('ISRC', xmlEscape(sr.isrc)),
    xmlBlock('Title', [
      xmlBlock('TitleText', xmlEscape(sr.title)),
    ].join('')),
    xmlTag('Duration', String(sr.duration)),
    xmlBlock('TechnicalDetails', techChildren),
    xmlTag('DisplayArtistName', xmlEscape(sr.displayArtistName)),
    artistChildren,
    xmlBlock('Genre', genreChildren),
    xmlTag('PLine', xmlEscape(sr.pLine)),
    ...(sr.releaseDate ? [xmlTag('ReleaseDate', xmlEscape(sr.releaseDate))] : []),
  ].join(''));
}

/** Build the Release element */
function buildRelease(rel: DdexRelease): string {
  const artistChildren = rel.displayArtist.map((a) =>
    xmlBlock('DisplayArtist', [
      xmlBlock('PartyName', [
        xmlBlock('FullName', xmlEscape(a.partyName)),
      ].join('')),
      xmlTag('ArtistRole', xmlEscape(a.role)),
    ].join(''))
  ).join('');

  const genreChildren = [
    xmlTag('GenreText', xmlEscape(rel.genre.genreText)),
    ...(rel.genre.subGenre ? [xmlTag('SubGenre', xmlEscape(rel.genre.subGenre))] : []),
  ].join('');

  const resourceRefChildren = rel.resourceReferenceList.map((ref) =>
    xmlTag('ResourceReleaseReference', xmlEscape(ref), { ReleaseResourceType: 'SecondaryResource' })
  ).join('');

  return xmlBlock('Release', [
    xmlTag('ReleaseId', xmlEscape(rel.releaseId)),
    xmlTag('ReleaseReference', xmlEscape(rel.releaseReference)),
    xmlTag('UPC', xmlEscape(rel.upc)),
    xmlBlock('Title', [
      xmlBlock('TitleText', xmlEscape(rel.title)),
    ].join('')),
    xmlTag('DisplayArtistName', xmlEscape(rel.displayArtistName)),
    artistChildren,
    xmlTag('CLine', xmlEscape(rel.cLine)),
    xmlTag('PLine', xmlEscape(rel.pLine)),
    xmlTag('Imprint', xmlEscape(rel.imprint)),
    xmlBlock('Genre', genreChildren),
    xmlTag('ReleaseDate', xmlEscape(rel.releaseDate)),
    xmlTag('ReleaseType', xmlEscape(rel.releaseType)),
    xmlBlock('ResourceReferenceList', resourceRefChildren),
    xmlTag('ExplicitContent', String(rel.explicitContent)),
  ].join(''));
}

/** Build a single Deal element */
function buildDeal(deal: DdexDeal): string {
  const territoryChildren = deal.territoryCode.map((tc) =>
    xmlTag('TerritoryCode', xmlEscape(tc))
  ).join('');

  const useConstraintChildren = deal.useConstraints?.map((uc) =>
    xmlBlock('UseConstraint', [
      xmlTag('UseType', xmlEscape(uc.useType)),
      ...(uc.consumerRetailPrice ? [xmlTag('ConsumerRetailPrice', String(uc.consumerRetailPrice))] : []),
    ].join(''))
  ).join('') ?? '';

  const validityChildren = deal.validityPeriod ? [
    xmlTag('StartDateTime', xmlEscape(deal.validityPeriod.startDateTime)),
    ...(deal.validityPeriod.endDateTime ? [xmlTag('EndDateTime', xmlEscape(deal.validityPeriod.endDateTime))] : []),
  ].join('') : '';

  return xmlBlock('Deal', [
    xmlTag('DealReference', xmlEscape(deal.dealReference)),
    xmlTag('CommercialModelType', xmlEscape(deal.commercialModelType)),
    xmlBlock('TerritoryCode', territoryChildren),
    ...(useConstraintChildren ? [xmlBlock('UseConstraints', useConstraintChildren)] : []),
    ...(validityChildren ? [xmlBlock('ValidityPeriod', validityChildren)] : []),
  ].join(''));
}

/** Build the RightsAgreementInfo element */
function buildRightsAgreement(info: NonNullable<DdexErnMessage['rightsAgreementInfo']>): string {
  return xmlBlock('RightsAgreementInfo', [
    xmlTag('RightsAgreementId', xmlEscape(info.rightsAgreementId)),
    xmlTag('RightsAgreementType', xmlEscape(info.rightsAgreementType)),
    xmlBlock('RightsController', [
      xmlTag('PartyId', xmlEscape(info.rightsController.partyId)),
      xmlBlock('PartyName', [
        xmlBlock('FullName', xmlEscape(info.rightsController.partyName)),
      ].join('')),
      xmlTag('Role', xmlEscape(info.rightsController.role)),
    ].join('')),
  ].join(''));
}

// ============ MAIN EXPORT ============

/**
 * Build DDEX ERN 4.2 XML from a DdexErnMessage object.
 * Produces a complete, schema-valid XML document with proper namespaces
 * that can be delivered to DSPs via SFTP/API endpoints.
 *
 * Namespace mapping:
 * - ernm: DDEX ERN message namespace (urn:ddex:ern:42)
 * - ern: DDEX ERN element namespace (urn:ddex:ern:42)
 *
 * The output includes all required top-level elements:
 * - MessageHeader (sender/recipient identification)
 * - ResourceList (SoundRecording resources with ISRC, technical details)
 * - ReleaseList (Release with UPC, C-Line, P-Line, imprint)
 * - DealList (commercial models per territory)
 * - RightsAgreementInfo (rights controller identification)
 */
export function buildDdexErnXml(message: DdexErnMessage): string {
  const resourceListChildren = message.resourceList.soundRecording.map(buildSoundRecording).join('');
  const releaseListChildren = buildRelease(message.releaseList.release);
  const dealListChildren = message.dealList.deal.map(buildDeal).join('');
  const rightsInfo = message.rightsAgreementInfo ? buildRightsAgreement(message.rightsAgreementInfo) : '';

  const body = [
    buildMessageHeader(message.messageHeader),
    xmlBlock('ResourceList', resourceListChildren),
    xmlBlock('ReleaseList', releaseListChildren),
    xmlBlock('DealList', dealListChildren),
    rightsInfo,
  ].filter(Boolean).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<ernm:NewReleaseMessage
  xmlns:ernm="urn:ddex:ern:42"
  xmlns:ern="urn:ddex:ern:42"
  MessageSchemaVersionId="ern/42"
  ReleaseProfileVersionId="CommonReleaseProfile/22"
  AvsVersionId="3"
  LanguageAndScriptCode="en">
  ${body}
</ernm:NewReleaseMessage>`;
}
