import { Controller, Get, Post, Body } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { DatabaseService } from '../database/database.service';

@Controller('test-spotify')
export class TestSpotifyController {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get('simulate-auth')
  async simulateAuth() {
    return {
      message: 'Spotify auth simulation endpoint',
      instructions: [
        'Use POST /test-spotify/create-mock-connection to simulate a Spotify connection',
        'Then use GET /test-spotify/mock-profile to test profile retrieval',
      ],
    };
  }

  @Post('create-mock-connection')
  async createMockConnection(@Body() body: { userId: number }) {
    const { userId } = body;

    return {
      success: true,
      message: 'Mock Spotify connection simulated (no database storage for test)',
      connection: {
        id: 'mock_connection_123',
        provider: 'spotify',
        userId: userId,
        connectedAt: new Date(),
      },
    };
  }

  @Get('mock-profile')
  async getMockProfile() {
    // Return mock Spotify profile data
    return {
      id: 'mock_spotify_user_123',
      display_name: 'Test User',
      email: 'test@example.com',
      followers: { total: 42 },
      images: [
        {
          url: 'https://via.placeholder.com/64x64.png?text=User',
          height: 64,
          width: 64,
        },
      ],
      country: 'FR',
      product: 'premium',
    };
  }

  @Get('mock-playlists')
  async getMockPlaylists() {
    // Return mock Spotify playlists
    return {
      items: [
        {
          id: 'mock_playlist_1',
          name: 'My Test Playlist',
          description: 'A test playlist for development',
          images: [{ url: 'https://via.placeholder.com/300x300.png?text=Playlist' }],
          tracks: { total: 25 },
          public: true,
        },
        {
          id: 'mock_playlist_2', 
          name: 'Liked Songs',
          description: 'Your liked songs',
          images: [{ url: 'https://via.placeholder.com/300x300.png?text=Liked' }],
          tracks: { total: 157 },
          public: false,
        },
      ],
      total: 2,
    };
  }

  @Get('mock-now-playing')
  async getMockNowPlaying() {
    // Return mock currently playing track
    return {
      is_playing: true,
      item: {
        id: 'mock_track_123',
        name: 'Test Song',
        artists: [{ name: 'Test Artist', id: 'mock_artist_123' }],
        album: {
          name: 'Test Album',
          images: [{ url: 'https://via.placeholder.com/300x300.png?text=Album' }],
        },
        duration_ms: 210000,
        external_urls: { spotify: 'https://open.spotify.com/track/mock_track_123' },
      },
      progress_ms: 45000,
    };
  }

  @Get('validate-integration')
  async validateIntegration() {
    try {
      // Test database connection to Spotify service
      const spotifyService = await this.databaseService.service.findFirst({
        where: { name: 'Spotify' },
        include: {
          actions: true,
          reactions: true,
        },
      });

      if (!spotifyService) {
        return {
          success: false,
          error: 'Spotify service not found in database',
        };
      }

      // Test that all expected actions and reactions exist
      const expectedActions = [
        'new_liked_song',
        'new_playlist_track', 
        'now_playing_changed',
        'new_top_artist',
        'new_playlist_created',
      ];

      const expectedReactions = [
        'add_to_playlist',
        'like_song',
        'create_playlist', 
        'follow_artist',
        'send_webhook',
      ];

      const actionKeys = spotifyService.actions.map(a => a.key);
      const reactionKeys = spotifyService.reactions.map(r => r.key);

      const missingActions = expectedActions.filter(key => !actionKeys.includes(key));
      const missingReactions = expectedReactions.filter(key => !reactionKeys.includes(key));

      return {
        success: true,
        service: {
          id: spotifyService.id,
          name: spotifyService.name,
          actionsCount: spotifyService.actions.length,
          reactionsCount: spotifyService.reactions.length,
        },
        validation: {
          allActionsPresent: missingActions.length === 0,
          allReactionsPresent: missingReactions.length === 0,
          missingActions,
          missingReactions,
        },
        endpoints: {
          profile: '/spotify/profile',
          playlists: '/spotify/playlists', 
          nowPlaying: '/spotify/now-playing',
          poll: '/spotify/poll',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
