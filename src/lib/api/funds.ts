import { FundWithCurrentValues } from "../types/fund";
import { FilterState, SortConfig } from "../types/screener";
import { getAllFundsWithCurrentValues, MOCK_AS_OF_DATE } from "../data/mock-daily-values";

export function getAsOfDate(): string {
  return MOCK_AS_OF_DATE;
}

export function getAllFunds(): FundWithCurrentValues[] {
  return getAllFundsWithCurrentValues();
}

export function getFundByTicker(ticker: string): FundWithCurrentValues | undefined {
  return getAllFunds().find((f) => f.ticker === ticker);
}

export function getFilteredFunds(filters: FilterState): FundWithCurrentValues[] {
  return getAllFunds().filter((fund) => {
    if (!filters.referenceAssets.includes(fund.referenceAssetTicker)) return false;
    if (!filters.bufferTypes.includes(fund.bufferType)) return false;
    if (!filters.seriesMonths.includes(fund.seriesMonth)) return false;

    const days = fund.currentValues.remainingOutcomePeriodDays;
    if (days < filters.daysRemainingMin || days > filters.daysRemainingMax) return false;

    return true;
  });
}

export function getSortedFunds(
  funds: FundWithCurrentValues[],
  sort: SortConfig
): FundWithCurrentValues[] {
  const sorted = [...funds];
  const dir = sort.direction === "asc" ? 1 : -1;

  sorted.sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;

    switch (sort.column) {
      case "ticker":
        aVal = a.ticker; bVal = b.ticker; break;
      case "name":
        aVal = a.name; bVal = b.name; break;
      case "referenceAsset":
        aVal = a.referenceAssetTicker; bVal = b.referenceAssetTicker; break;
      case "bufferType":
        aVal = a.bufferType; bVal = b.bufferType; break;
      case "startingCapNet":
        aVal = a.outcomePeriod.startingCapNet; bVal = b.outcomePeriod.startingCapNet; break;
      case "remainingCapNet":
        aVal = a.currentValues.remainingCapNet; bVal = b.currentValues.remainingCapNet; break;
      case "remainingBufferNet":
        aVal = a.currentValues.remainingBufferNet; bVal = b.currentValues.remainingBufferNet; break;
      case "downsideBeforeBuffer":
        aVal = a.currentValues.downsideBeforeBuffer; bVal = b.currentValues.downsideBeforeBuffer; break;
      case "daysRemaining":
        aVal = a.currentValues.remainingOutcomePeriodDays; bVal = b.currentValues.remainingOutcomePeriodDays; break;
      case "periodEnd":
        aVal = a.outcomePeriod.endDate; bVal = b.outcomePeriod.endDate; break;
      default:
        return 0;
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * dir;
    }
    return ((aVal as number) - (bVal as number)) * dir;
  });

  return sorted;
}
