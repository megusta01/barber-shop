import { Role, ROLES } from '@barbearia/shared'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true, index: true })
  googleId: string

  @Prop({ required: true, lowercase: true, trim: true })
  email: string

  @Prop({ required: true, trim: true })
  displayName: string

  @Prop({ default: '' })
  avatarUrl: string

  @Prop({ default: '', trim: true })
  phone: string

  @Prop({ default: '', trim: true })
  description: string

  @Prop({ type: String, enum: ROLES, default: Role.CLIENT, index: true })
  role: Role

  @Prop({ default: true })
  isActive: boolean

  /** Fica `true` até o usuário completar o perfil pela primeira vez. */
  @Prop({ default: true })
  isFirstLogin: boolean

  createdAt: Date
  updatedAt: Date
}

export type UserDocument = HydratedDocument<User>

export const UserSchema = SchemaFactory.createForClass(User)
