import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' }); // Use 'email' as the username field
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        // Custom failure response for authentication error
        throw new UnauthorizedException({
          result: null,
          status: 500,
          message: 'Invalid credentials',
        });
      }
      return user; // Return the user if authentication is successful
    } catch (error) {
      // Catch any other errors and structure the response accordingly
      throw new UnauthorizedException({
        result: null,
        status: 500,
        message: error.message || 'Unauthorized request',
      });
    }
  }
}
