import type { BatmanCriminal } from '@batman/data/criminals.js';
import type { Crime } from '@batman/data/crimes.js';
import type { CrimeScene } from '@batman/data/crime-scene.js';
import { ApiClient } from './apiClient.js';

type AuthenticatedRequest<T> = T & { token?: string };

class GCPDApiClient extends ApiClient {
  async getCriminals(options?: AuthenticatedRequest<{ affiliation?: string }>): Promise<BatmanCriminal[]> {
    let url = '/criminals';
    const searchParams = new URLSearchParams();
    if (options?.affiliation) {
      searchParams.append('affiliation', options.affiliation);
      url += `?${searchParams}`;
    }
    return this.fetch(url);
  }

  async getCrimes(
    options: AuthenticatedRequest<{ city: string; suspect?: string[]; molecule?: string[]; fingerprint?: string[] }>,
  ): Promise<{ crimes: Crime[]; center: { lat: number; lng: number } }> {
    let url = '/crimes';
    const searchParams = new URLSearchParams();
    searchParams.append('city', options.city);
    options?.fingerprint?.forEach((it) => searchParams.append('suspect', it));
    options?.molecule?.forEach((it) => searchParams.append('molecule', it));
    options?.fingerprint?.forEach((it) => searchParams.append('fingerprint', it));

    url += `?${searchParams.toString()}`;

    return this.fetch(url);
  }

  async getCrimeScene(auth: string): Promise<CrimeScene> {
    return this.fetch('/crime-scene', {
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    });
  }

  async getCrimeSceneWithForensic(): Promise<CrimeScene> {
    return this.fetch('/crime-scene/forensics');
  }
}

export const GCPDClient = new GCPDApiClient();
