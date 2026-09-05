import os
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np

def process_portrait():
    src_path = r'c:\apsara situala\apsara sitaula projects\port\assets\profile-cutout.png'
    out_path = r'c:\apsara situala\apsara sitaula projects\port\assets\profile-cutout-integrated.png'

    if not os.path.exists(src_path):
        print("Source cutout does not exist!")
        return

    im = Image.open(src_path).convert('RGBA')
    w, h = im.size
    print(f"Loaded portrait: {w}x{h}")

    arr = np.array(im, dtype=np.float32)
    alpha = arr[:, :, 3]

    # Create a smooth organic feathering mask to remove the sharp rectangular cut
    # Left edge: feather across 120px
    x_indices = np.arange(w)
    left_ramp = np.clip(x_indices / 120.0, 0.0, 1.0)
    left_ease = 3 * (left_ramp ** 2) - 2 * (left_ramp ** 3) # smoothstep

    # Right edge: feather across 150px
    right_ramp = np.clip((w - 1 - x_indices) / 150.0, 0.0, 1.0)
    right_ease = 3 * (right_ramp ** 2) - 2 * (right_ramp ** 3) # smoothstep

    horizontal_mask = left_ease * right_ease

    # Bottom edge: feather across bottom 450px so torso dissolves naturally
    y_indices = np.arange(h)
    bottom_start = h - 450
    bottom_ramp = np.clip((h - 1 - y_indices) / 450.0, 0.0, 1.0)
    bottom_ease = 3 * (bottom_ramp ** 2) - 2 * (bottom_ramp ** 3)

    # Top edge: gently soften top 40px
    top_ramp = np.clip(y_indices / 40.0, 0.0, 1.0)
    top_ease = 3 * (top_ramp ** 2) - 2 * (top_ramp ** 3)

    vertical_mask = bottom_ease * top_ease

    # 2D combined mask
    mask_2d = np.outer(vertical_mask, horizontal_mask)

    # Apply to existing alpha
    new_alpha = alpha * mask_2d
    arr[:, :, 3] = new_alpha

    # Subtly enhance contrast & color saturation so she pops against the rose brush
    result_img = Image.fromarray(arr.astype(np.uint8), 'RGBA')
    
    # Save
    result_img.save(out_path)
    print(f"Saved feathered portrait to {out_path}")

if __name__ == '__main__':
    process_portrait()
