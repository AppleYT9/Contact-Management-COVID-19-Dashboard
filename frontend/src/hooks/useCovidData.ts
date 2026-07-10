import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface GlobalStats {
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  population: number;
}

export interface HistoricalData {
  cases: Record<string, number>;
  deaths: Record<string, number>;
  recovered: Record<string, number>;
}

export interface CountryStats {
  country: string;
  countryInfo: {
    _id: number;
    iso2: string;
    iso3: string;
    lat: number;
    long: number;
    flag: string;
  };
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  active: number;
  critical: number;
}

export const useCovidGlobal = () => {
  return useQuery<GlobalStats>({
    queryKey: ['covidGlobal'],
    queryFn: async () => {
      const response = await axios.get('https://disease.sh/v3/covid-19/all');
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useCovidHistorical = () => {
  return useQuery<HistoricalData>({
    queryKey: ['covidHistorical'],
    queryFn: async () => {
      const response = await axios.get('https://disease.sh/v3/covid-19/historical/all?lastdays=120');
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useCovidCountries = () => {
  return useQuery<CountryStats[]>({
    queryKey: ['covidCountries'],
    queryFn: async () => {
      const response = await axios.get('https://disease.sh/v3/covid-19/countries');
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};
